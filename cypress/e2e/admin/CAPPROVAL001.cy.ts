describe("CAMPAIGN007 - Admin approves pending campaign", () => {

    it("should approve pending campaign successfully", () => {
  
      cy.visit("/auth");
  
      cy.get("#email")
        .type("admin@nepalHands.com");
  
      cy.get("#password")
        .type("Admin@123");
  
      cy.get('button[type="submit"]')
        .click();
  
      cy.url()
        .should("include", "/profile");
  
  
      cy.visit("/admin/approvals");
  
  
      // Open campaign details
      cy.contains("Pending Campaign Approvals")
        .should("exist");
  
        cy.get("#view-campaign-details")
        .first()
        .click();
  
  
      // Modal opened
      cy.contains("Campaign Request Details")
        .should("exist");
  
  
      // Click approve in modal
      cy.get("#confirm-approve")
  .click();


// confirmation dialog
cy.contains("Approve Campaign")
  .should("exist");


// click actual confirmation button
cy.get("#confirmation-approve")
  .click();


cy.contains("Campaign approved!")
  .should("exist");
    });
  
  });