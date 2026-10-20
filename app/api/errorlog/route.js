import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const logDir = path.join(process.cwd(), "log");
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(
      path.join(logDir, "client-error.log"),
      `\n[${new Date().toISOString()}]\nMESSAGE: ${body.message}\nSTACK:\n${body.stack}\nCOMPONENT STACK:\n${body.componentStack}\n`
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
