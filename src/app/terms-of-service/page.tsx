
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto glassmorphism">
        <CardHeader>
            <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
                    <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>Please read these terms and conditions carefully before using Our Service.</p>
            
            <h2 id="interpretation-and-definitions">Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
            <h3>Definitions</h3>
            <p>For the purposes of these Terms and Conditions:</p>
            <ul>
                <li><strong>"Account"</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                <li><strong>"Company"</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to GamerVerse.</li>
                <li><strong>"Service"</strong> refers to the Website.</li>
                <li><strong>"Terms and Conditions"</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
                <li><strong>"Website"</strong> refers to GamerVerse, accessible from the current domain.</li>
                <li><strong>"You"</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h2 id="acknowledgment">Acknowledgment</h2>
            <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
            <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
            <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
            <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>

            <h2 id="user-accounts">User Accounts</h2>
            <p>When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on our Service.</p>
            <p>You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.</p>
            <p>You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account.</p>

            <h2 id="purchases-and-payment">Purchases and Payment</h2>
            <p>If You wish to purchase any product made available through the Service ("Purchase"), You may be asked to supply certain information relevant to Your Purchase. All purchases are subject to our payment and delivery policy as outlined in our FAQ and Help Center.</p>
            <p>Order statuses are marked as 'Pending' until payment is manually verified by our administrators. Upon successful verification, the status will be changed to 'Completed', and the product will be delivered via email as specified.</p>

            <h2 id="intellectual-property">Intellectual Property</h2>
            <p>The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the country and foreign countries.</p>
            
            <h2 id="limitation-of-liability">Limitation of Liability</h2>
            <p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service.
            To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever.</p>

            <h2 id="governing-law">Governing Law</h2>
            <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
            
            <h2 id="changes-to-these-terms">Changes to These Terms and Conditions</h2>
            <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.</p>
            
            <h2 id="contact-us">Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, You can contact us by visiting the <a href="/contact">contact page</a> on our website.</p>
        </CardContent>
      </Card>
    </div>
  );
}
