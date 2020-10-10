const sendgridTransport = require("nodemailer-sendgrid-transport");
const nodemailer = require("nodemailer");

const config = require("../config");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: config.apikey,
    },
  })
);

exports.sendOtpEmail = (email, otp) => {
  transporter
    .sendMail({
      to: email,
      from: "naman1913128@akgec.ac.in",
      subject: "Verification OTP for InternBazaar",
      html: `<table align="center" cellpadding="0" cellspacing="0" border="0" width="100%"bgcolor="#f0f0f0">
        <tr>
        <td style="padding: 30px 30px 20px 30px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" style="max-width: 650px; margin: auto;">
            <tr>
                <td colspan="2" align="center" style="background-color: #333; padding: 40px;">
                  <p style="color:white; font-size:40px;">Otp For Verification</p>
  <!--                     <a href="http://wso2.com/" target="_blank"><img src="http://cdn.wso2.com/wso2/newsletter/images/nl-2017/wso2-logo-transparent.png" border="0" /></a> -->
                </td>
            </tr>
            <tr>
  <!--                 <td colspan="2" align="center" style="padding: 50px 50px 0px 50px;">
                    <h1 style="padding-right: 0em; margin: 0; line-height: 40px; font-weight:300; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; color: #666; text-align: left; padding-bottom: 1em;">
                        Internbazaar
                    </h1>
                </td> -->
            </tr>
            <tr>
                <td style="text-align: left; padding: 0px 50px;" valign="top">
  <!--                     <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; color: #666; text-align: left; padding-bottom: 3%;">
                        Hi {{user.claims.givenname}},
                    </p> -->
                  <br>
                    <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; color: #666; text-align: left; padding-bottom: 3%;">
                        Please use this one time password ${otp} to verify your account.
                    </p>
                </td>
            </tr>
            <tr>
                <td style="text-align: left; padding: 30px 50px 50px 50px" valign="top">
                    <p style="font-size: 18px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; color: #505050; text-align: left;">
                        Thanks,<br/>InternBazaar Team
                    </p>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="padding: 20px 40px 40px 40px;" bgcolor="#f0f0f0">
                    <p style="font-size: 12px; margin: 0; line-height: 24px; font-family: 'Nunito Sans', Arial, Verdana, Helvetica, sans-serif; color: #777;">
                        &copy; 2020
                        <a href="http://localhost:3000/" target="_blank" style="color: #777; text-decoration: none">InternBazaar</a>
                        <br>
                        AKGEC, Ghaziabad
                    </p>
                </td>
            </tr>
            </table>
        </td>
    </tr>
  </table>`,
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.sendPasswordResetEmail = (email, link) => {
  transporter
    .sendMail({
      to: email,
      from: "naman1913128@akgec.ac.in",
      subject: "Password reset link for InternBazaar",
      html: `<div style="width: 100% !important; height: 100%; -webkit-text-size-adjust: none; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; margin: 0;" bgcolor="#F4F4F7">
      <span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Use this link to reset your password. The link is only valid for 24 hours.</span>
      <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7; margin: 0; padding: 0;" bgcolor="#F4F4F7">
        <tr>
          <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; margin: 0; padding: 0;">
              <tr>
                <td class="email-masthead" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; text-align: center; padding: 25px 0;" align="center">
                  <a href="https://example.com" class="f-fallback email-masthead_name" style="color: #A8AAAF; font-size: 16px; font-weight: bold; text-decoration: none; text-shadow: 0 1px 0 white;">
                  InternBazaar
                </a>
                </td>
              </tr>
              <!-- Email Body -->
              <tr>
                <td class="email-body" width="100%" cellpadding="0" cellspacing="0" style="word-break: break-word; margin: 0; padding: 0; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;" bgcolor="#FFFFFF">
                  <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width: 570px; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF; margin: 0 auto; padding: 0;" bgcolor="#FFFFFF">
                    <!-- Body content -->
                    <tr>
                      <td class="content-cell" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; padding: 35px;">
                        <div class="f-fallback">
                          <h1 style="margin-top: 0; color: #333333; font-size: 22px; font-weight: bold; text-align: left;" align="left">Hi,</h1>
                          <p style="font-size: 16px; line-height: 1.625; color: #51545E; margin: .4em 0 1.1875em;">You recently requested to reset your password for your InternBazaar account. Use the button below to reset it. <strong>This password reset is only valid for the next 1 hour.</strong></p>
                          <!-- Action -->
                          <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center; margin: 30px auto; padding: 0;">
                            <tr>
                              <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                                <!-- Border based button
             https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                  <tr>
                                    <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                                      <a href="${link}" class="f-fallback button button--green" target="_blank" style="color: #FFF; border-color: #22bc66; border-style: solid; border-width: 10px 18px; background-color: #22BC66; display: inline-block; text-decoration: none; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); -webkit-text-size-adjust: none; box-sizing: border-box;">Reset your password</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <p style="font-size: 16px; line-height: 1.625; color: #51545E; margin: .4em 0 1.1875em;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                          <p style="font-size: 16px; line-height: 1.625; color: #51545E; margin: .4em 0 1.1875em;">Thanks,
                            <br />The InternBazaar Team</p>
                          <!-- Sub copy -->
                          <table class="body-sub" role="presentation" style="margin-top: 25px; padding-top: 25px; border-top-width: 1px; border-top-color: #EAEAEC; border-top-style: solid;">
                            <tr>
                              <td style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                                <p class="f-fallback sub" style="font-size: 13px; line-height: 1.625; color: #6B6E76; margin: .4em 0 1.1875em;">If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>
                                <p class="f-fallback sub" style="font-size: 13px; line-height: 1.625; color: #6B6E76; margin: .4em 0 1.1875em;"><a href="${link}">${link}</a></p>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                  <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width: 570px; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center; margin: 0 auto; padding: 0;">
                    <tr>
                      <td class="content-cell" align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; padding: 35px;">
                        <p class="f-fallback sub align-center" style="font-size: 13px; line-height: 1.625; text-align: center; color: #6B6E76; margin: .4em 0 1.1875em;" align="center">© 2020 InternBazaar. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`,
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
