import { jsPDF } from 'jspdf';
import type { OtHeader, OtRow } from './types';
import { formatAmPm, computeDurationLabel } from './time';

const PAGE_W = 210;
const PAGE_H = 297;
const COLS = 2;
const ROWS = 2;
const SLIP_W = PAGE_W / COLS;
const SLIP_H = PAGE_H / ROWS;

const LOGO_ASPECT = 94 / 449;

async function loadLogoDataUrl(): Promise<string | null> {
	try {
		const res = await fetch('/litecloud-logo.png');
		const blob = await res.blob();
		return await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
}

function drawCutGuides(doc: jsPDF) {
	doc.setDrawColor(150);
	doc.setLineWidth(0.2);
	doc.setLineDashPattern([1.5, 1.5], 0);
	doc.line(SLIP_W, 0, SLIP_W, PAGE_H);
	doc.line(0, SLIP_H, PAGE_W, SLIP_H);
	doc.setLineDashPattern([], 0);
}

function drawSlip(
	doc: jsPDF,
	originX: number,
	originY: number,
	logoDataUrl: string | null,
	header: OtHeader,
	row: OtRow,
	index: number,
	total: number
) {
	const FRAME = 3;
	const MARGIN = originX + FRAME + 3;
	const RIGHT = originX + SLIP_W - FRAME - 3;
	let y = originY + FRAME + 4;

	doc.setDrawColor(0);
	doc.setLineWidth(0.3);
	doc.rect(originX + FRAME, originY + FRAME, SLIP_W - FRAME * 2, SLIP_H - FRAME * 2);

	const logoW = 30;
	const logoH = logoW * LOGO_ASPECT;
	if (logoDataUrl) {
		doc.addImage(logoDataUrl, 'PNG', originX + SLIP_W / 2 - logoW / 2, y, logoW, logoH);
		y += logoH + 2.5;
	} else {
		doc.setFont('times', 'bold');
		doc.setFontSize(10);
		doc.text('Litecloud', originX + SLIP_W / 2, y, { align: 'center' });
		y += 5;
	}
	doc.setFont('times', 'bold');
	doc.setFontSize(7);
	doc.text('OVERTIME FORM', originX + SLIP_W / 2, y, { align: 'center' });
	y += 2;
	doc.setLineWidth(0.2);
	doc.line(MARGIN, y, RIGHT, y);
	y += 4;

	doc.setFont('times', 'normal');
	doc.setFontSize(6.5);

	const contentWidth = RIGHT - MARGIN;

	const labeledLine = (label: string, value: string, labelWidth: number, underlineLen?: number) => {
		doc.text(`${label}:`, MARGIN, y);
		const valueX = MARGIN + labelWidth;
		doc.text(value || '', valueX + 0.8, y);
		doc.setLineWidth(0.15);
		const len = underlineLen ?? RIGHT - valueX;
		doc.line(valueX, y + 0.7, valueX + len, y + 0.7);
		y += 4.3;
	};

	labeledLine('Employee Name', header.employeeName, 17);
	labeledLine('Position', header.position, 17);
	labeledLine('Branch', header.branch, 17);
	labeledLine('Work Schedule', header.workSchedule, 20);
	y += 3.5;

	if (total > 1) {
		doc.setFont('times', 'italic');
		doc.setFontSize(5.5);
		doc.text(`Copy ${index + 1} of ${total}`, RIGHT, originY + FRAME + 2, { align: 'right' });
		doc.setFont('times', 'normal');
		doc.setFontSize(6.5);
	}

	labeledLine('Date', row.date, 10, contentWidth * 0.45);
	y += 2;

	const halfW = contentWidth * 0.22;
	doc.text('From:', MARGIN, y);
	doc.text(formatAmPm(row.timeFrom), MARGIN + 7, y);
	doc.line(MARGIN + 6.5, y + 0.7, MARGIN + 6.5 + halfW, y + 0.7);
	const toX = MARGIN + contentWidth * 0.5 + 2;
	doc.text('To:', toX, y);
	doc.text(formatAmPm(row.timeEnd), toX + 7, y);
	doc.line(toX + 6.5, y + 0.7, toX + 6.5 + halfW, y + 0.7);
	y += 4.3 + 2;

	labeledLine('Total Min/Hrs', computeDurationLabel(row.timeFrom, row.timeEnd), 20, contentWidth * 0.25);

	doc.text('Reason for Overtime:', MARGIN, y);
	y += 3;
	doc.setFontSize(6);
	const reasonLines = doc.splitTextToSize(row.reason || '', RIGHT - MARGIN).slice(0, 2);
	doc.text(reasonLines, MARGIN, y);
	doc.setFontSize(6.5);
	const reasonLineY = y + (Math.max(reasonLines.length, 1) - 1) * 2.8 + 0.7;
	doc.setLineWidth(0.15);
	doc.line(MARGIN, reasonLineY, RIGHT, reasonLineY);
	y = reasonLineY + 8;

	const colWidth = (RIGHT - MARGIN - 4) / 2;

	const signatureBlock = (label: string, sublabel: string, x: number, width: number, lineY: number) => {
		doc.setFontSize(6.5);
		doc.text(`${label}:`, x, lineY - 5);
		doc.setLineWidth(0.2);
		doc.line(x, lineY, x + width, lineY);
		doc.setFontSize(5);
		doc.text(sublabel, x + width / 2, lineY + 2.6, { align: 'center' });
	};

	const sigLineY = y + 5;
	signatureBlock('Requested by', 'Employee Signature', MARGIN, colWidth, sigLineY);
	signatureBlock('Verified by', 'Immediate Head', MARGIN + colWidth + 4, colWidth, sigLineY);
	y = sigLineY + 10;

	doc.setFontSize(6.5);
	doc.text('Approved by:', MARGIN, y);
	doc.line(MARGIN + 15, y + 0.7, MARGIN + colWidth, y + 0.7);
	doc.text('Date Approved:', MARGIN + colWidth + 4, y);
	doc.line(MARGIN + colWidth + 22, y + 0.7, RIGHT, y + 0.7);
}

export async function generateOtFormPdf(header: OtHeader, rows: OtRow[]): Promise<void> {
	// Open the tab synchronously (before any await) so popup blockers don't swallow it.
	const previewWindow = window.open('', '_blank');

	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	const logoDataUrl = await loadLogoDataUrl();
	const perPage = COLS * ROWS;

	rows.forEach((row, i) => {
		const posOnPage = i % perPage;
		if (i > 0 && posOnPage === 0) {
			doc.addPage();
		}
		if (posOnPage === 0) {
			drawCutGuides(doc);
		}
		const col = posOnPage % COLS;
		const rowIdx = Math.floor(posOnPage / COLS);
		drawSlip(doc, col * SLIP_W, rowIdx * SLIP_H, logoDataUrl, header, row, i, rows.length);
	});

	const fileSafeName = (header.employeeName || 'Employee').trim().replace(/\s+/g, '_');
	doc.setProperties({ title: `OT_Form_${fileSafeName}` });

	const blobUrl = doc.output('bloburl').toString();
	if (previewWindow) {
		previewWindow.location.href = blobUrl;
	} else {
		window.open(blobUrl, '_blank');
	}
}
