import PageShell, { LegalSection } from "@/components/PageShell";

const Privacy = () => (
  <PageShell
    eyebrow="Legal"
    title="Privacy Policy"
  >
    <LegalSection heading="1. Who we are">
      <p>Nepal Hands operates a crowdfunding and volunteer platform for causes in Nepal. This policy covers the website, donor and volunteer accounts, and organizer tools.</p>
    </LegalSection>
    <LegalSection heading="2. Information we collect">
      <p>Account information you provide: name, email address, phone number, password, profile photo, bio, skills, and interests.</p>
      <p>Verification (KYC) information you submit when you fundraise or organize: citizenship or PAN details, date of birth, address (province, district, municipality, ward), occupation, source of funds, and uploaded documents such as citizenship images and a selfie.</p>
      <p>Campaign and organization documents: registration certificates, PAN/VAT records, signatory details, and bank account information used for payouts.</p>
      <p>Activity data: donations made, campaigns created, volunteer applications, invitations, messages in activity group chats, and notification preferences.</p>
      <p>Technical data: IP address, browser type, device information, and pages visited.</p>
    </LegalSection>
    <LegalSection heading="3. How we use your information">
      <p>To operate your account, process donations in NPR, review campaigns and KYC submissions, match volunteers to opportunities, send transactional notifications, prevent fraud and abuse.</p>
    </LegalSection>
    <LegalSection heading="4. What is public">
      <p>Campaign pages, organizer names, published expense ledgers, milestones, and proof-of-impact uploads are public. Donations may display your name and amount unless you choose to give anonymously. KYC documents and bank details are never public.</p>
    </LegalSection>
    <LegalSection heading="5. Sharing with third parties">
      <p>We share data with service providers who help us run the platform, including our hosting and database provider, payment processors (eSewa), and email delivery services. We may disclose information where required by Nepali law or valid legal process. We do not sell personal data.</p>
    </LegalSection>
    
    <LegalSection heading="6. Retention">
      <p>We keep account data while your account is active. Donation and financial records are retained as required for accounting and regulatory purposes. Verification documents are retained for the period required to evidence our checks, then deleted.</p>
    </LegalSection>
    <LegalSection heading="7. Your choices">
      <p>You can review and update your profile at any time, adjust notification preferences, request a copy of your data, or ask us to delete your account. Some records must be retained where the law requires it.</p>
    </LegalSection>

  </PageShell>
);

export default Privacy;