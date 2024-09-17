const login = document.querySelector("#login");
const password = document.querySelector("#password");
const loginBtn = document.querySelector("#loginBtn");
const btnText = loginBtn.querySelector("span");
const loader = loginBtn.querySelector(".loader");
const form = document.querySelector("#form");
const onSuccess = document.querySelector("#onSuccess");
const onError = document.querySelector("#onError");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  logInAccount();
});

login.addEventListener("input", () => {
  login.removeAttribute("aria-invalid");
  onError.classList.add("hidden");
});

password.addEventListener("input", () => {
  password.removeAttribute("aria-invalid");
  onError.classList.add("hidden");
});

async function logInAccount() {
  toggleLoader(true);
  try {
    const resp = await fetch(
      `https://test-works.pr-uni.ru/api/login/index.php?login=${login.value}&password=${password.value}`
    );
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const res = await resp.json();
    if (res.status === "ok") {
      document.cookie = `token=${res.token};secure;samesite=strict;max-age=3600`;
      onSuccess.innerText = `${res.user.name}, Вы успешно авторизованы!`;
      onSuccess.classList.remove("hidden");
      form.style.display = "none";
    } else {
      handleLoginError(res.errorMessage);
    }
  } catch (error) {
    handleLoginError("Произошла ошибка, попробуйте еще раз позже.");
    console.error("Ошибка при авторизации:", error);
  } finally {
    toggleLoader(false);
  }
}

function toggleLoader(isLoading) {
  if (isLoading) {
    btnText.classList.add("hidden");
    loader.classList.remove("hidden");
    login.disabled = true;
    password.disabled = true;
    loginBtn.disabled = true;
  } else {
    btnText.classList.remove("hidden");
    loader.classList.add("hidden");
    login.disabled = false;
    password.disabled = false;
    loginBtn.disabled = false;
  }
}

function handleLoginError(errorMessage) {
  login.ariaInvalid = "true";
  password.ariaInvalid = "true";
  onError.innerText = errorMessage;
  onError.classList.remove("hidden");
}
