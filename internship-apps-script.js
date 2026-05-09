function doGet(e) {
  return handleInternship(e);
}

function doPost(e) {
  return handleInternship(e);
}

function handleInternship(e) {

  var RECIPIENT_EMAIL = "qwetrumtechnologies@gmail.com"; // ← Apni email yahan likho

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

  // Also log to a Google Sheet (optional — create a sheet named "Applications")
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Applications");
    if (!sheet) {
      sheet = ss.insertSheet("Applications");
      sheet.appendRow(["Timestamp","Name","Email","Phone","DOB","City","Gender",
        "University","Degree","Semester","CGPA","Skills","Portfolio","Experience",
        "Department","Work Mode","Motivation","Heard From","Emergency Contact"]);
    }
    sheet.appendRow([time, name, email, phone, dob, city, gender,
      university, degree, semester, cgpa, skills, portfolio, experience,
      department, workmode, motivation, heardFrom, emergency]);
  } catch(err) {}

  var htmlBody = `
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

  function row(label, value) {
    return '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;"><tr><td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 16px;"><p style="margin:0 0 2px;font-size:10px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">' + label + '</p><p style="margin:0;font-size:14px;font-weight:500;color:#fff;">' + value + '</p></td></tr></table>';
  }

  var plainBody =
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
    body    : plainBody,
    htmlBody: htmlBody,
    replyTo : email
  });

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
