import PageShell, { LegalSection } from "@/components/PageShell";

const Terms = () => (
  <PageShell
    eyebrow="Legal"
    title="Terms of Service"
  >
    <LegalSection heading="1. Acceptance">
      <p>
        By creating an account or using Nepal Hands, you agree to these Terms
        of Service. If you use the platform on behalf of an organization, you
        confirm that you have appropriate authority to represent that
        organization.
      </p>
    </LegalSection>

    <LegalSection heading="2. Accounts">
      <p>
        You must provide accurate and complete information when creating an
        account. You are responsible for maintaining the confidentiality of
        your account credentials and for activities performed through your
        account.
      </p>

      <p>
        Nepal Hands may restrict or suspend accounts that violate these terms,
        misuse the platform, provide false information, or breach applicable
        laws and regulations.
      </p>
    </LegalSection>

    <LegalSection heading="3. Campaigns and volunteer opportunities">
      <p>
        Organizers are responsible for the accuracy of campaign information,
        volunteer opportunity details, submitted documents, and the proper
        use of funds received through the platform.
      </p>

      <p>
        Campaigns and volunteer opportunities may require review before being
        published. Approval confirms that submitted information has passed
        platform verification checks and does not represent a guarantee of
        campaign success, organizer reliability, or expected outcomes.
      </p>

      <p>
        Organizers must provide truthful information, avoid misuse of funds,
        and provide transparency updates where required.
      </p>
    </LegalSection>

    <LegalSection heading="4. Donations">
      <p>
        Donations are processed in Nepalese Rupees through available payment
        service providers. Donations are intended to support the selected
        campaign and may not be refundable except where required by law,
        payment provider policies, or platform decisions.
      </p>

      <p>
        Nepal Hands facilitates connections between donors and organizers but
        does not guarantee campaign outcomes. Any applicable platform or
        payment processing fees will be displayed before completing a
        transaction.
      </p>
    </LegalSection>

    <LegalSection heading="5. Volunteering">
      <p>
        Volunteer participation is arranged between volunteers and
        organizers. Nepal Hands provides a platform for connection and
        coordination but does not employ volunteers or directly manage
        activities conducted by organizers.
      </p>

      <p>
        Volunteers should review opportunity details, consider possible risks,
        and follow safety instructions provided by organizers.
      </p>
    </LegalSection>

    <LegalSection heading="6. Prohibited conduct">
      <p>
        Users must not provide false or altered information, upload
        unauthorized documents, impersonate others, harass participants,
        misuse platform features, attempt to bypass security measures, or use
        Nepal Hands for fraudulent or unlawful activities.
      </p>
    </LegalSection>

    <LegalSection heading="7. Content">
      <p>
        You retain ownership of the content you upload, including text,
        images, and documents. By uploading content, you grant Nepal Hands
        permission to store, display, and process that content only as
        necessary to operate, maintain, and improve the platform.
      </p>

      <p>
        Nepal Hands may remove content that violates these terms, applicable
        laws, or platform safety standards.
      </p>
    </LegalSection>

    <LegalSection heading="8. Moderation and enforcement">
      <p>
        Nepal Hands may review, restrict, pause, or remove campaigns,
        volunteer opportunities, or accounts that violate these terms or
        create risks for users.
      </p>

      <p>
        Where necessary, Nepal Hands may delay transaction processing,
        investigate suspicious activity, or report suspected unlawful
        activities to relevant authorities.
      </p>
    </LegalSection>

    <LegalSection heading="9. Disclaimers and liability">
      <p>
        Nepal Hands is provided on an "as available" basis. To the extent
        permitted by applicable law, Nepal Hands is not responsible for
        indirect losses or for actions, decisions, or failures of organizers,
        volunteers, donors, or third-party service providers.
      </p>
    </LegalSection>

    <LegalSection heading="10. Governing law and changes">
      <p>
        These terms are governed by the laws of Nepal. Any disputes will be
        handled according to applicable Nepalese laws and courts.
      </p>

      <p>
        Nepal Hands may update these terms from time to time. Changes will be
        published on this page with an updated revision date.
      </p>

      <p>
        Questions regarding these terms:
        support@nepalhands.org
      </p>
    </LegalSection>
  </PageShell>
);

export default Terms;