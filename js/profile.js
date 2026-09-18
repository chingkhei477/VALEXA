renderLayout("");
const user = requireAuth();

if (user) {
  document.getElementById("p-name").value = user.name;
  document.getElementById("p-email").value = user.email;
  document.getElementById("p-phone").value = user.phone || "";

  const profileForm = document.getElementById("profile-form");
  const profileMsg = document.getElementById("profile-message");

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = updateProfile(user.id, {
      name: document.getElementById("p-name").value,
      phone: document.getElementById("p-phone").value,
    });
    if (!result.ok) {
      showFormMessage(profileMsg, result.error);
      return;
    }
    showFormMessage(profileMsg, "Your details have been updated.", "success");
    document.getElementById("dash-greeting")?.remove();
  });

  const passwordForm = document.getElementById("password-form");
  const passwordMsg = document.getElementById("password-message");

  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const current = document.getElementById("current-password").value;
    const next = document.getElementById("new-password").value;
    const result = await changePassword(user.id, current, next);
    if (!result.ok) {
      showFormMessage(passwordMsg, result.error);
      return;
    }
    showFormMessage(passwordMsg, "Your password has been updated.", "success");
    passwordForm.reset();
  });
}
