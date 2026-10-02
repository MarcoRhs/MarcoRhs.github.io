#!/usr/bin/env python3
"""Build the public PDF CV from resume.md, keeping the bot and download in sync."""

from html import escape
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, HRFlowable, Image, KeepTogether,
    PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "Marco_Rohns_CV.pdf"
INK = colors.HexColor("#1D1D1F")
BLUE = colors.HexColor("#0071E3")
MUTED = colors.HexColor("#5E6066")
RULE = colors.HexColor("#D2D2D7")


def style(name, **options):
    base = dict(fontName="Helvetica", fontSize=8.9, leading=12.6,
                textColor=INK, alignment=TA_LEFT)
    base.update(options)
    return ParagraphStyle(name, **base)


NAME = style("name", fontName="Helvetica-Bold", fontSize=25, leading=28)
TITLE = style("title", fontSize=11.4, leading=15, textColor=BLUE)
META = style("meta", fontSize=8.4, leading=12, textColor=MUTED)
SECTION = style("section", fontName="Helvetica-Bold", fontSize=9,
                leading=12, textColor=BLUE)
ROLE = style("role", fontName="Helvetica-Bold", fontSize=9.6, leading=12.6)
DATE = style("date", fontSize=8.2, leading=11.3, textColor=MUTED)
DETAIL = style("detail", fontSize=8.2, leading=11.3, textColor=MUTED)
BODY = style("body", fontSize=8.9, leading=12.7)
BULLET = style("bullet", fontSize=8.8, leading=12.4, leftIndent=9,
               firstLineIndent=-9, spaceAfter=2)


def markup(text):
    text = escape(text)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)


def section(label):
    return [
        Spacer(1, 8), Paragraph(label.upper(), SECTION), Spacer(1, 2),
        HRFlowable(width="100%", thickness=.7, color=RULE, spaceAfter=4),
    ]


def split_sections(lines):
    sections = {}
    current = None
    for line in lines:
        if line.startswith("## "):
            current = line[3:]
            sections[current] = []
        elif current is not None:
            sections[current].append(line)
    return sections


def build():
    lines = (ROOT / "resume.md").read_text(encoding="utf-8").splitlines()
    sections = split_sections(lines)
    doc = BaseDocTemplate(
        str(OUT), pagesize=A4, leftMargin=17 * mm, rightMargin=17 * mm,
        topMargin=14 * mm, bottomMargin=15 * mm,
        title="Marco Rohns — CV", author="Marco Rohns",
        subject="AI products and enterprise customer success",
        keywords="AI, RAG, customer success, enterprise adoption, Kotlin, Supabase",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height,
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    def footer(canvas, current_doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 7.4)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(A4[0] - 17 * mm, 9 * mm,
                               f"Marco Rohns · CV · page {current_doc.page}")
        canvas.restoreState()

    doc.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=footer))
    intro = [line for line in lines[:lines.index("## Summary")] if line.strip()]
    title = intro[1].strip("*")
    left = [Paragraph(escape(intro[0][2:]), NAME), Spacer(1, 2),
            Paragraph(escape(title), TITLE), Spacer(1, 5)]
    left.extend(Paragraph(escape(line), META) for line in intro[2:])
    photo = Image(str(ROOT / "photo.jpg"), width=25 * mm, height=25 * mm)
    header = Table([[left, photo]], colWidths=[doc.width - 28 * mm, 28 * mm])
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story = [header]

    story += section("Summary")
    story.append(Paragraph(markup(" ".join(x for x in sections["Summary"] if x.strip())), BODY))

    story += section("Experience")
    jobs = []
    for line in sections["Experience"]:
        if line.startswith("### "):
            jobs.append({"role": line[4:], "date": "", "detail": "", "bullets": []})
        elif jobs and line.startswith("- "):
            jobs[-1]["bullets"].append(line[2:])
        elif jobs and line.strip() and not jobs[-1]["date"]:
            jobs[-1]["date"] = line
        elif jobs and line.strip():
            jobs[-1]["detail"] = line
    for job in jobs:
        block = [Paragraph(markup(job["role"]), ROLE),
                 Paragraph(escape(job["date"]), DATE)]
        if job["detail"]:
            block.append(Paragraph(escape(job["detail"]), DETAIL))
        block.append(Spacer(1, 2))
        block.extend(Paragraph("–&nbsp;&nbsp;" + markup(item), BULLET)
                     for item in job["bullets"])
        block.append(Spacer(1, 5))
        if len(job["bullets"]) <= 3:
            story.append(KeepTogether(block))
        else:
            first_bullet = 4 if job["detail"] else 3
            story.append(KeepTogether(block[:first_bullet + 1]))
            story.extend(block[first_bullet + 1:])

    for key in ("Skills", "Certifications & Education", "Languages"):
        items = [line[2:] if line.startswith("- ") else line
                 for line in sections[key] if line.strip()]
        paras = [Paragraph(("–&nbsp;&nbsp;" if key != "Languages" else "") + markup(item),
                           BULLET if key != "Languages" else BODY) for item in items]
        if paras:
            story.append(KeepTogether(section(key) + paras[:1]))
            story.extend(paras[1:])

    doc.build(story)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    build()
