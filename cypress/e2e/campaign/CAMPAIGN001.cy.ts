describe("CAMPAIGN001 - Create campaign successfully", () => {
    it("should create a campaign with valid information", () => {
  
      // Login
      cy.visit("/auth");
  
      cy.get("#email").type("shakya.pratyush789@gmail.com");
      cy.get("#password").type("NewPassword1");
  
      cy.get('button[type="submit"]').click();
  
      cy.url().should("include", "/profile");
  
  
      // Open create campaign
      cy.visit("/organizer/campaign/create");
  
  
      // -----------------------
      // Step 1: Basics
      // -----------------------
      cy.get("#campaign-title")
      .type("Clean Water Project Nepal");
  
      cy.contains("Water & Sanitation").click();

      cy.get("#campaign-location")
      .type("Kathmandu");
  
      cy.contains("Continue").click();
  
  
      // -----------------------
      // Step 2: Story
      // -----------------------
      cy.get("textarea")
        .eq(0)
        .type("Providing clean drinking water facilities to rural communities.");
  
      cy.get("textarea")
        .eq(1)
        .type(
          "This project aims to build sustainable water systems for communities that lack access to safe drinking water. Funds will be used for construction and maintenance."
        );
  
      cy.get("textarea")
        .eq(2)
        .type(
          "Install water pipelines\nBuild water storage tanks"
        );
  
      cy.contains("Continue").click();
  
  
  
      // -----------------------
      // Step 3: Goal
      // -----------------------
      cy.get("#campaign-goal")
      .type("50000");
  
      cy.get('input[placeholder*="Nepal Water"]')
        .type("Nepal Water Foundation");
  
      cy.contains("Continue").click();
  
  
  
      // -----------------------
      // Step 4: Media
      // -----------------------
cy.get("#campaign-cover-image")
  .selectFile(
    "cypress/fixtures/campaign.jpg",
    { force: true }
  );
  
      cy.contains("Continue").click();
  
  
  
      // -----------------------
      // Step 5: Schedule
      // -----------------------
      cy.get('input[type="date"]')
        .eq(0)
        .type("2026-09-01");
  
      cy.get('input[type="date"]')
        .eq(1)
        .type("2026-12-01");
  
      cy.get('input[placeholder="Full name"]')
        .type("Pratyush Shakya");
  
        cy.get("#campaign-contact-email")
        .type("contact@test.org");
  
      cy.contains("Continue").click();
  
  
  
      // -----------------------
      // Step 6: Verification
      // -----------------------
  
      // Organization details
      cy.get('input[placeholder*="As registered"]')
        .type("Nepal Water Foundation");
  
      cy.contains("NGO").click();
  
      cy.get('input[placeholder*="12345"]')
        .type("12345/078");
  
      cy.get('input[placeholder*="District Administration"]')
        .type("District Administration Office Kathmandu");
  
      cy.get('input[placeholder*="9-digit PAN"]')
        .type("123456789");
  
  
      // Authorized signatory
      cy.get('input[placeholder="Full legal name"]')
        .type("Pratyush Shakya");
  
      cy.get('input[placeholder*="Chairperson"]')
        .type("Chairperson");
  
  
      // Bank details
      cy.get('input[placeholder*="Nabil Bank"]')
        .type("Nabil Bank");
  
      cy.get('input[placeholder*="As per bank record"]')
        .type("Nepal Water Foundation");
  
      cy.get('input[placeholder="Account no."]')
        .type("1234567890");
  
  
      // Upload required documents
      cy.get('input[type="file"]')
        .each(($input) => {
          cy.wrap($input)
            .selectFile(
              "cypress/fixtures/document.pdf",
              { force: true }
            );
        });
  
  
      // Accept declaration
      cy.get('input[type="checkbox"]')
        .check();
  
  
      cy.contains("Continue")
        .click();
  
  
  
      // -----------------------
      // Review Page
      // -----------------------
      cy.contains("Submit Campaign")
        .should("exist");
  
  
      cy.contains("Submit Campaign")
        .click();
  
  
      // after successful submit
      cy.url()
        .should("include", "/organizer");
  
    });
  });