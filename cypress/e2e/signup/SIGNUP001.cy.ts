describe("SIGNUP001 - Sign Up page loading", () => {
    it("should display the sign up form", () => {
      cy.visit("/auth");
  
      cy.contains("Sign Up").click();
  
      cy.get("#firstName").should("be.visible");
      cy.get("#lastName").should("be.visible");
      cy.get("#email").should("be.visible");
      cy.get("#password").should("be.visible");
      cy.contains("button", "Create Account").should("be.visible");
    });
  });