
(() => {
  const EMAILJS_PUBLIC_KEY  = "FVzUqof6ZXH96DqcL";
  const EMAILJS_SERVICE_ID  = "service_w0dvej8";
  const EMAILJS_TEMPLATE_ID = "template_2frq0wy";

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setState = (msg, ok = true) => {
    feedback.style.display = "block";
    feedback.textContent = msg;
    feedback.style.color = ok ? "#ffffff" : "#ffb4b4";
  };

  // Helpers
  const showError = (el, hintMsg) => {
    el.classList.remove("is-valid");
    el.classList.add("is-invalid");
    el.setAttribute("aria-invalid", "true");
    const hintId = el.getAttribute("aria-describedby");
    if (hintId) {
      const hint = document.getElementById(hintId);
      if (hint) {
        if (hintMsg) hint.textContent = hintMsg;
        hint.classList.add("show");
      }
    }
  };

  const clearError = (el) => {
    el.classList.remove("is-invalid");
    el.removeAttribute("aria-invalid");
    const hintId = el.getAttribute("aria-describedby");
    if (hintId) {
      const hint = document.getElementById(hintId);
      if (hint) hint.classList.remove("show");
    }
  };

  const markValid = (el) => {
    el.classList.remove("is-invalid");
    el.classList.add("is-valid");
    el.removeAttribute("aria-invalid");
    const hintId = el.getAttribute("aria-describedby");
    if (hintId) {
      const hint = document.getElementById(hintId);
      if (hint) hint.classList.remove("show");
    }
  };

  const isEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const validateFields = () => {
    let firstInvalid = null;

    const nameEl = form.elements["name"];
    const emailEl = form.elements["email"];
    const msgEl   = form.elements["message"];

    // Name
    if (!nameEl.value.trim()) {
      showError(nameEl, "Please enter your full name.");
      firstInvalid ??= nameEl;
    } else {
      markValid(nameEl);
    }

    // Email
    const emailVal = emailEl.value.trim();
    if (!emailVal) {
      showError(emailEl, "Please enter your email.");
      firstInvalid ??= emailEl;
    } else if (!isEmail(emailVal)) {
      showError(emailEl, "Please enter a valid email (e.g. name@domain.com).");
      firstInvalid ??= emailEl;
    } else {
      markValid(emailEl);
    }

    // Message
    if (!msgEl.value.trim()) {
      showError(msgEl, "Please write a brief message.");
      firstInvalid ??= msgEl;
    } else {
      markValid(msgEl);
    }

    return firstInvalid;
  };


  ["input", "blur"].forEach(evt => {
    form.addEventListener(evt, (e) => {
      const t = e.target;
      if (!t.classList.contains("form-control")) return;


      if (t.name === "email") {
        const v = t.value.trim();
        if (v && isEmail(v)) markValid(t);
        else clearError(t);
      } else {
        if (t.value.trim()) markValid(t);
        else clearError(t);
      }
    }, true);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();


    const honey = form.querySelector("#c-company");
    if (honey && honey.value.trim() !== "") return;


    const firstInvalid = validateFields();
    if (firstInvalid) {
      setState("Please fix the highlighted fields.", false);
      firstInvalid.focus({ preventScroll: false });
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const prev = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    // Payload
    const templateParams = {
      from_name:  form.elements["name"].value.trim(),
      from_email: form.elements["email"].value.trim(),
      phone:      form.elements["phone"].value.trim(),
      message:    form.elements["message"].value.trim(),
      page_url:   window.location.href,
      date:       new Date().toLocaleString()
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      setState("Message sent. We'll get back to you soon.");
      // Reset
      form.reset();
      [...form.querySelectorAll(".form-control")].forEach(el => {
        el.classList.remove("is-invalid", "is-valid");
        clearError(el);
      });
    } catch (err) {
      console.error("[EmailJS] send error:", err);
      setState("Oops. Something went wrong sending your message.", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = prev;
    }
  });
})();
