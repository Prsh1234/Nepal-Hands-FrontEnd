describe("SIGNUP005 - Empty form", () => {
    it("should display validation messages", () => {
      cy.visit("/auth");
      cy.contains("Sign Up").click();
  
      cy.contains("button", "Create Account").click();
  
      cy.contains("First name must be at least 2 characters").should("be.visible");
      cy.contains("Last name must be at least 2 characters").should("be.visible");
      cy.contains("Enter a valid email").should("be.visible");
      cy.contains("Password must contain at least one uppercase letter, one lowercase letter, and one number").should("be.visible");
    });
  });