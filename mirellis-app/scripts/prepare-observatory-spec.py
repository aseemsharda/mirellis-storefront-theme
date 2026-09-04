from pathlib import Path
from shutil import copyfile

SOURCE = Path('/Users/aseem/.codex/.chatgpt-projects/g-p-68a583386d9481918840fb251b9a3ede/deliverables/Mirellis Personal Observatory v4 — Private Reflection, Learning Record & Self-Understanding Specification.docx')
TARGET = Path('/Users/aseem/Documents/Mirellis New/mirellis-app/docs/specifications/Mirellis Personal Observatory v4 — Private Reflection, Learning Record & Self-Understanding Specification.docx')

TARGET.parent.mkdir(parents=True, exist_ok=True)
copyfile(SOURCE, TARGET)
print(TARGET)
