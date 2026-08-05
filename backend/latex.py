import os
import subprocess
import tempfile
import shutil


def compile_to_pdf(tex_content: str) -> bytes:
    """
    Compile LaTeX content to PDF using latexmk.
    Returns the PDF file bytes.
    Raises RuntimeError if compilation fails.
    """
    tmp_dir = tempfile.mkdtemp(prefix="resume_opt_")
    tex_path = os.path.join(tmp_dir, "resume.tex")
    pdf_path = os.path.join(tmp_dir, "resume.pdf")

    try:
        # Write .tex file
        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(tex_content)

        # Run latexmk
        result = subprocess.run(
            [
                "latexmk",
                "-pdf",
                "-interaction=nonstopmode",
                f"-output-directory={tmp_dir}",
                tex_path,
            ],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=tmp_dir,
        )

        # Check if PDF was generated
        if not os.path.exists(pdf_path):
            error_msg = _extract_latex_errors(tmp_dir)
            raise RuntimeError(error_msg)

        # Read and return PDF
        with open(pdf_path, "rb") as f:
            return f.read()

    except subprocess.TimeoutExpired:
        raise RuntimeError("LaTeX compilation timed out (60s limit).")

    except FileNotFoundError:
        raise RuntimeError(
            "latexmk not found. Please install TeX Live: https://tug.org/texlive/"
        )

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def _extract_latex_errors(tmp_dir: str) -> str:
    """Extract error messages from the LaTeX log file."""
    log_path = os.path.join(tmp_dir, "resume.log")

    if not os.path.exists(log_path):
        return "LaTeX compilation failed (no log file)."

    try:
        with open(log_path, "r", encoding="utf-8", errors="ignore") as f:
            log = f.read()
    except Exception:
        return "LaTeX compilation failed (could not read log)."

    # Find lines starting with "!" which indicate errors
    errors = [line.strip() for line in log.split("\n") if line.startswith("!")]

    if errors:
        return "LaTeX errors: " + "; ".join(errors[:5])

    return "LaTeX compilation failed (no PDF generated). Check your LaTeX code."
