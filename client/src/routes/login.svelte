<script lang="ts">
  import { onMount } from "svelte";

  let jwt: string | null = null;
  let user: any = null;

  function initGoogle() {
    gapi.load("auth2", () => {
      const auth2 = gapi.auth2.init({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      });

      auth2.attachClickHandler(
        document.getElementById("googleBtn")!,
        {},
        async (googleUser: any) => {
          const idToken = googleUser.getAuthResponse().id_token;

          // Отправляем на бэкенд
          const res = await fetch("/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          const data = await res.json();
          jwt = data.token;
          user = data.user;
          console.log("JWT:", jwt);
          console.log("User:", user);
        },
        (err: any) => console.error(err)
      );
    });
  }

  onMount(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);
  });
</script>

<button id="googleBtn">Войти через Google</button>

{#if jwt}
  <p>Привет, {user.name}!</p>
{/if}
