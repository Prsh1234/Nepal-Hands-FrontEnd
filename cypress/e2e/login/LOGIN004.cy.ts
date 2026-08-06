describe("LOGIN004 - Empty credentials", () => {
    it("should show validation errors", () => {
      cy.visit("/auth");
  
      cy.get('button[type="submit"]').click()
  
      cy.contains("Enter a valid email").should("be.visible");
      cy.contains("Password must contain at least one uppercase letter, one lowercase letter, and one number").should("be.visible");
    });
  });