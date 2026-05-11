// ============================================================
//  QWETRUM TECHNOLOGIES — Internship Application Handler
//  Paste this entire file into Google Apps Script editor
//  Deploy as Web App → Execute as: Me → Anyone can access
// ============================================================

// ─── CONFIGURATION ──────────────────────────────────────────
var RECIPIENT_EMAIL  = "qwetrumtechnologies@gmail.com"; // ← Team ka email
var SHEET_NAME       = "Applications";                   // ← Sheet tab ka naam
var SPREADSHEET_ID   = "";  // ← OPTIONAL: Agar alag spreadsheet use karni ho toh ID yahan likho
                             //   Warna khali rakhein — same spreadsheet use hogi
// ────────────────────────────────────────────────────────────

function doGet(e) {
  return handleInternship(e);
}

function doPost(e) {
  return handleInternship(e);
}

function handleInternship(e) {

  var p = e.parameter || {};
  var name       = p.name       || "N/A";
  var email      = p.email      || "N/A";
  var phone      = p.phone      || "N/A";
  var dob        = p.dob        || "N/A";
  var city       = p.city       || "N/A";
  var gender     = p.gender     || "N/A";
  var university = p.university || "N/A";
  var degree     = p.degree     || "N/A";
  var semester   = p.semester   || "N/A";
  var cgpa       = p.cgpa       || "N/A";
  var skills     = p.skills     || "N/A";
  var portfolio  = p.portfolio  || "Not provided";
  var experience = p.experience || "N/A";
  var department = p.department || "N/A";
  var workmode   = p.workmode   || "N/A";
  var motivation = p.motivation || "N/A";
  var heardFrom  = p.heardFrom  || "N/A";
  var emergency  = p.emergency  || "Not provided";

  var time = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

  // ── 1. GOOGLE SHEET MEIN DATA SAVE KARO ──────────────────
  try {
    var ss;
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    var sheet = ss.getSheetByName(SHEET_NAME);

    // Agar sheet exist nahi karti toh nai banao with headers
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp", "Full Name", "Email", "Phone", "Date of Birth",
        "City", "Gender", "University", "Degree", "Semester", "CGPA",
        "Skills", "Portfolio", "Experience", "Department",
        "Work Mode", "Motivation", "Heard From", "Emergency Contact"
      ]);

      // Header row ko bold + green background
      var headerRange = sheet.getRange(1, 1, 1, 19);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#41ebaa");
      headerRange.setFontColor("#000000");
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 160);
      sheet.setColumnWidth(3, 200);
      sheet.setColumnWidth(12, 200);
      sheet.setColumnWidth(17, 300);
    }

    sheet.appendRow([
      time, name, email, phone, dob, city, gender,
      university, degree, semester, cgpa, skills, portfolio, experience,
      department, workmode, motivation, heardFrom, emergency
    ]);

  } catch(err) {
    Logger.log("Sheet Error: " + err.toString());
  }

  // ── 2. TEAM KO EMAIL (same as before) ─────────────────────
  var adminHtmlBody = buildAdminEmail(
    name, email, phone, dob, city, gender,
    university, degree, semester, cgpa, skills, portfolio,
    experience, department, workmode, motivation, heardFrom, emergency, time
  );

  var adminPlainBody =
    "NEW INTERNSHIP APPLICATION — Qwetrum Technologies\n" +
    "====================================================\n\n" +
    "Name       : " + name + "\n" +
    "Email      : " + email + "\n" +
    "Phone      : " + phone + "\n" +
    "City       : " + city + "\n" +
    "University : " + university + "\n" +
    "Degree     : " + degree + "\n" +
    "Semester   : " + semester + "\n" +
    "Department : " + department + "\n" +
    "Skills     : " + skills + "\n" +
    "Work Mode  : " + workmode + "\n\n" +
    "Motivation :\n" + motivation + "\n\n" +
    "Received   : " + time;

  MailApp.sendEmail({
    to      : RECIPIENT_EMAIL,
    subject : "🎓 Intern Application: " + name + " — " + department + " | Qwetrum",
    body    : adminPlainBody,
    htmlBody: adminHtmlBody,
    replyTo : email
  });

  // ── 3. STUDENT KO CONFIRMATION EMAIL ──────────────────────
  if (email !== "N/A" && email.indexOf("@") !== -1) {
    try {
      var studentHtmlBody = buildStudentConfirmationEmail(name, department, skills, workmode);

      var studentPlainBody =
        "Dear " + name + ",\n\n" +
        "Thank you for applying to Qwetrum Technologies Internship Program.\n\n" +
        "We have successfully received your application for the " + department + " department.\n" +
        "Our team is currently reviewing all applications and will contact shortlisted candidates within 5–7 business days.\n\n" +
        "Application Details:\n" +
        "  Department  : " + department + "\n" +
        "  Skills      : " + skills + "\n" +
        "  Work Mode   : " + workmode + "\n\n" +
        "While you wait, feel free to explore our work:\n" +
        "  Website  : https://qwetrumtechnologies.com\n" +
        "  LinkedIn : https://linkedin.com/company/qwetrum-technologies\n" +
        "  Instagram: https://instagram.com/qwetrumtechnologies\n\n" +
        "Best regards,\n" +
        "Qwetrum Technologies — Internship Team\n" +
        "qwetrumtechnologies@gmail.com";

      MailApp.sendEmail({
        to      : email,
        subject : "Application Received — Qwetrum Technologies Internship",
        body    : studentPlainBody,
        htmlBody: studentHtmlBody,
        replyTo : RECIPIENT_EMAIL
      });
    } catch(err) {
      Logger.log("Student Email Error: " + err.toString());
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ─── STUDENT CONFIRMATION EMAIL TEMPLATE ──────────────────────────────────────
function buildStudentConfirmationEmail(name, department, skills, workmode) {
  var firstName = name.split(" ")[0];
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr><td style="background:linear-gradient(135deg,#0d1a0d,#0a1a10);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;border:1px solid rgba(65,235,170,0.25);border-bottom:none;">
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
          <tr><td style="width:54px;height:54px;background:linear-gradient(135deg,#41ebaa,#10a84f);border-radius:50%;text-align:center;vertical-align:middle;">
            <span style="font-size:26px;font-weight:900;color:#fff;line-height:54px;">Q</span>
          </td></tr>
        </table>
        <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#fff;">Qwetrum Technologies</h1>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1.5px;text-transform:uppercase;">Internship Program 2026</p>
      </td></tr>

      <!-- SUCCESS BANNER -->
      <tr><td style="background:#0F1425;padding:28px 40px 0;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <table cellpadding="16" cellspacing="0" style="background:rgba(65,235,170,0.08);border:1px solid rgba(65,235,170,0.3);border-radius:12px;width:100%;text-align:center;">
          <tr><td>
            <div style="font-size:36px;margin-bottom:8px;"></div>
            <p style="margin:0;font-size:20px;font-weight:700;color:#41ebaa;">Application Received!</p>
            <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">We have successfully received your internship application.</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- GREETING -->
      <tr><td style="background:#0F1425;padding:28px 40px 0;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <p style="margin:0 0 14px;font-size:17px;color:#f0f4ff;line-height:1.6;">Dear <strong style="color:#41ebaa;">${firstName}</strong>,</p>
        <p style="margin:0 0 14px;font-size:15px;color:rgba(240,244,255,0.75);line-height:1.75;">
          Thank you for applying to the <strong style="color:#fff;">Qwetrum Technologies Internship Program</strong>. We are excited to learn about your profile and are glad you chose us to begin your professional journey.
        </p>
        <p style="margin:0;font-size:15px;color:rgba(240,244,255,0.75);line-height:1.75;">
          Your application has been forwarded to our hiring team and is currently <strong style="color:#41ebaa;">under review</strong>. We carefully evaluate each candidate and will get back to shortlisted applicants within <strong style="color:#fff;">5–7 business days</strong>.
        </p>
      </td></tr>

      <!-- APPLICATION SUMMARY -->
      <tr><td style="background:#0F1425;padding:24px 40px 0;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;">Your Application Summary</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 16px;">
              <p style="margin:0 0 2px;font-size:10px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">🏢 Department Applied</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#fff;">${department}</p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 16px;">
              <p style="margin:0 0 2px;font-size:10px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">🛠 Skills You Submitted</p>
              <p style="margin:0;font-size:14px;color:#fff;">${skills}</p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 16px;">
              <p style="margin:0 0 2px;font-size:10px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">💻 Preferred Work Mode</p>
              <p style="margin:0;font-size:14px;color:#fff;">${workmode}</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- NEXT STEPS -->
      <tr><td style="background:#0F1425;padding:24px 40px 0;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;">What Happens Next?</p>
        <table cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:12px;width:100%;padding:6px 0;">
          <tr><td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0;font-size:14px;color:rgba(240,244,255,0.8);line-height:1.6;">
              <span style="color:#41ebaa;font-weight:700;">Step 1</span> &nbsp;— Our team reviews your application thoroughly.
            </p>
          </td></tr>
          <tr><td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0;font-size:14px;color:rgba(240,244,255,0.8);line-height:1.6;">
              <span style="color:#41ebaa;font-weight:700;">Step 2</span> &nbsp;— Shortlisted candidates are contacted via email for an interview.
            </p>
          </td></tr>
          <tr><td style="padding:12px 20px;">
            <p style="margin:0;font-size:14px;color:rgba(240,244,255,0.8);line-height:1.6;">
              <span style="color:#41ebaa;font-weight:700;">Step 3</span> &nbsp;— Final selection and onboarding for selected interns.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- CONNECT WITH US -->
      <tr><td style="background:#0F1425;padding:24px 40px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;">Stay Connected</p>
        <table cellpadding="0" cellspacing="0" width="100%"><tr>
          <td style="padding-right:8px;">
            <a href="https://linkedin.com/company/qwetrum-technologies" style="display:block;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;text-decoration:none;color:#fff;font-size:13px;font-weight:600;">
              🔗 LinkedIn
            </a>
          </td>
          <td style="padding-right:8px;">
            <a href="https://instagram.com/qwetrumtechnologies" style="display:block;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;text-decoration:none;color:#fff;font-size:13px;font-weight:600;">
              📸 Instagram
            </a>
          </td>
          <td>
            <a href="https://qwetrumtechnologies.com" style="display:block;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;text-decoration:none;color:#fff;font-size:13px;font-weight:600;">
              🌐 Website
            </a>
          </td>
        </tr></table>
      </td></tr>

      <!-- DISCLAIMER -->
      <tr><td style="background:#0F1425;padding:0 40px 20px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <table cellpadding="12" cellspacing="0" style="background:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.2);border-radius:10px;width:100%;">
          <tr><td><p style="margin:0;font-size:13px;color:rgba(255,244,180,0.8);line-height:1.6;">
            ⚠️ <strong style="color:rgba(255,244,180,1);">Please note:</strong> Only shortlisted candidates will be contacted. If you do not hear from us within 10 business days, please consider your application unsuccessful for this cycle. You are welcome to reapply in the future.
          </p></td></tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#080d1a;border-radius:0 0 16px 16px;padding:22px 40px;border:1px solid rgba(65,235,170,0.25);border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.5);">© 2026 <strong style="color:rgba(255,255,255,0.75);">Qwetrum Technologies</strong> Pvt Ltd</p>
        <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.3);">Questions? Email us at <a href="mailto:qwetrumtechnologies@gmail.com" style="color:#41ebaa;text-decoration:none;">qwetrumtechnologies@gmail.com</a></p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">This is an automated confirmation email · Please do not reply directly to this email</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}


// ─── ADMIN/TEAM EMAIL TEMPLATE (same as original) ─────────────────────────────
function buildAdminEmail(name, email, phone, dob, city, gender,
  university, degree, semester, cgpa, skills, portfolio,
  experience, department, workmode, motivation, heardFrom, emergency, time) {

  function row(label, value) {
    return '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;"><tr><td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 16px;"><p style="margin:0 0 2px;font-size:10px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">' + label + '</p><p style="margin:0;font-size:14px;font-weight:500;color:#fff;">' + value + '</p></td></tr></table>';
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr><td style="background:linear-gradient(135deg,#0d1a0d,#0a1a10);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;border:1px solid rgba(65,235,170,0.25);border-bottom:none;">
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
          <tr><td style="width:54px;height:54px;background:linear-gradient(135deg,#41ebaa,#10a84f);border-radius:50%;text-align:center;vertical-align:middle;">
            <span style="font-size:26px;font-weight:900;color:#fff;line-height:54px;">Q</span>
          </td></tr>
        </table>
        <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#fff;">Qwetrum Technologies</h1>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1.5px;text-transform:uppercase;">New Internship Application Received</p>
      </td></tr>

      <!-- ALERT -->
      <tr><td style="background:#0F1425;padding:20px 40px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <table cellpadding="10" cellspacing="0" style="background:rgba(65,235,170,0.08);border:1px solid rgba(65,235,170,0.25);border-radius:10px;width:100%;">
          <tr><td><span style="font-size:14px;font-weight:700;color:#41ebaa;">🎓 New Intern Application — ${department}</span></td></tr>
        </table>
      </td></tr>

      <!-- BODY -->
      <tr><td style="background:#0F1425;padding:28px 40px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <p style="margin:0 0 18px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;">Personal Details</p>
        ${row('👤 Full Name', name)}
        ${row('✉️ Email', '<a href="mailto:' + email + '" style="color:#5BA5FF;text-decoration:none;">' + email + '</a>')}
        ${row('📞 Phone', phone)}
        ${row('🎂 Date of Birth', dob)}
        ${row('📍 City', city)}
        ${row('⚧ Gender', gender)}
        <p style="margin:20px 0 18px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;">Education</p>
        ${row('🏫 University', university)}
        ${row('📚 Degree', degree)}
        ${row('📅 Semester', semester)}
        ${row('🏆 CGPA', cgpa)}
        ${row('💼 Experience', experience)}
        <p style="margin:20px 0 18px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;">Skills & Links</p>
        ${row('🛠 Skills', skills)}
        ${row('🔗 Portfolio', portfolio !== 'Not provided' ? '<a href="' + portfolio + '" style="color:#5BA5FF;text-decoration:none;">' + portfolio + '</a>' : 'Not provided')}
        <p style="margin:20px 0 18px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;">Internship Preference</p>
        ${row('🏢 Department', '<strong style="color:#41ebaa;">' + department + '</strong>')}
        ${row('💻 Work Mode', workmode)}
        ${row('📣 Heard From', heardFrom)}
        ${row('🆘 Emergency', emergency)}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
          <tr><td style="background:rgba(65,235,170,0.04);border:1px solid rgba(65,235,170,0.15);border-radius:12px;padding:18px 20px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">💬 Motivation</p>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.82);line-height:1.75;">${motivation}</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- TIMESTAMP -->
      <tr><td style="background:#0F1425;padding:0 40px 20px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);text-align:right;">🕐 Received: ${time} (PKT)</p>
      </td></tr>

      <!-- REPLY BUTTON -->
      <tr><td style="background:#0F1425;padding:0 40px 32px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);text-align:center;">
        <a href="mailto:${email}?subject=Re: Internship Application — Qwetrum Technologies"
           style="display:inline-block;background:linear-gradient(135deg,#41ebaa,#10a84f);color:#000;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;">
          ↩ Reply to ${name}
        </a>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#080d1a;border-radius:0 0 16px 16px;padding:22px 40px;border:1px solid rgba(65,235,170,0.25);border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.5);">© 2026 <strong style="color:rgba(255,255,255,0.75);">Qwetrum Technologies</strong> Pvt Ltd</p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">Internship Application System · Auto-generated email</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}
