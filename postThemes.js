(async () => {
  const themes = [
    "general",
    "animals",
    "foods",
    "flags",
    "jobs",
    "objects",
    "verbs",
  ];

  try {
    const res = await fetch("http://localhost:3000/themes/create/multiples", {
      body: JSON.stringify({
        themes: themes.map((theme) => ({ name: theme })),
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error((await res.json()).message);
    }

    console.log("Success.");
  } catch (err) {
    console.error("Error", err);
  }
})();
