// Usage: node build_docx.js input.json output.docx
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Footer, PageNumber, TableOfContents, PageBreak, BorderStyle, LevelFormat,
} = require("docx");

const [, , inPath, outPath] = process.argv;
const d = JSON.parse(fs.readFileSync(inPath, "utf8"));
const RED = "F22F46", NAVY = "121C2D", SLATE = "606B85";

const kids = [];
kids.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: d.title, bold: true, size: 44, color: NAVY, font: "Arial" })] }));
kids.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: d.subtitle, size: 24, color: SLATE, font: "Arial" })] }));
kids.push(new Paragraph({
  spacing: { after: 240 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 6 } },
  children: [new TextRun({ text: `${d.author}  ·  ${d.date}`, size: 20, color: SLATE, font: "Arial" })],
}));
kids.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("How to use this document")] }));
d.how_to_use.forEach(t => kids.push(new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [new TextRun(t)] })));
kids.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Contents", bold: true, size: 24, color: NAVY })] }));
kids.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }));

d.personas.forEach(p => {
  kids.push(new Paragraph({ children: [new PageBreak()] }));
  kids.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(`${p.name}: ${p.role}`)] }));
  kids.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Lens: ", bold: true, color: RED }), new TextRun({ text: p.lens, color: SLATE })] }));
  p.questions.forEach((q, i) => {
    kids.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun(`${i + 1}. ${q.q}`)] }));
    kids.push(new Paragraph({ spacing: { after: 160, line: 300 }, children: [new TextRun(q.a)] }));
  });
});

const doc = new Document({
  creator: d.author, title: d.title,
  styles: {
    default: { document: { run: { font: "Arial", size: 21, color: NAVY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, font: "Arial", color: RED }, paragraph: { spacing: { before: 200, after: 60 }, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1260, right: 1260, bottom: 1260, left: 1260 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: `${d.title}  ·  `, size: 16, color: SLATE }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: SLATE })] })] }) },
    children: kids,
  }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(outPath, b); console.log("wrote", outPath); });
