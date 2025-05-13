import { application } from "express";

export function getTemplateHtml(type, data = {}) {
    switch (type) {
        case "applicant_registration":
            return `<h2>Welcome to DOI</h2><p>Thank you for registering with us.</p>`;

        case "application_submission":
            return `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2e6c80;">Application Submitted Successfully</h2>
                    <p>Dear ${data.applicantName},</p>
            
                    <p>We are pleased to inform you that your application  with <strong>application Id : ${data.applicationId}</strong>has been successfully submitted on ${data.loginTime}. Our team will now begin processing it.</p>
            
            
                    <p>You will receive further updates on the status of your application via email.</p>
            
                    <p>Thank you for choosing our services.</p>
            
                    <p>Warm regards,</p>
                    <p><strong>The Support Team</strong><br/>[Your Company Name]</p>
                </div>
                `;

        case "application_approved":
            return `<h2>Application Approved</h2><p>Your application has been approved. You can now proceed with the next steps.</p>`;


        case "application_received":
            return `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2e6c80;">New Application Received</h2>
                    <p>Dear ${data.applicantName},</p>
            
                    <p>A new application has been successfully received  ${data.loginTime}
 and is now available for your review.</p>
            
                   
            
                    <p>Please log in to the <a href="${data.portalLink}" style="color: #2e6c80; text-decoration: underline;">admin portal</a> to review the application and take necessary actions.</p>
            
            
                    <p>Warm regards,</p>
                    <p><strong>The Support Team</strong><br/>[Your Company Name]</p>
                </div>
                `;



        case "application_rejected":
            return `<h2>Application Rejected</h2><p>Unfortunately, your application has been rejected. Please contact support for more details.</p>`;

        case "application_query":
            return `<h2>Application Under Review</h2><p>Your application is currently under review. We will update you once the review is complete.</p>`;

        case "application_partial_approved":
            return `<h2>Application Partially Approved</h2><p>Your application has been partially approved. Please check your account for more details.</p>`;

        case "application_closed":
            return `<h2>Application Closed</h2><p>Your application has been closed and is ready for the loan disbursement process. If you have any questions, please contact support.</p>`;

        case "change_password":
            return `<h2>Password Changed</h2><p>Your password has been changed successfully. If this wasn't you, contact support immediately.</p>`;

        case "forgot_password":
            return `<h2>Reset Your Password</h2><p>Click the link below to reset your password:<br><a href="${data.resetLink || '#'}">Reset Password</a></p>`;

        case "login":
            return `<h2>New Login Detected</h2>
                        <p>Hi ${data.name},</p>
                        <p>You logged in at ${data.loginTime} from device: ${data.device} and location: ${data.location}.</p>
                        <p>If this wasn't you, contact support immediately.</p>`;


        default:
            return `<h2>Notification</h2><p>This is a general notification from YourApp.</p>`;
    }
}
