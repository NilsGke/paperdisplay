import { useEffect, useState } from "react";
import { z } from "zod";

/** settings schema to validate and provide typesafety */
const settingsZod = z.object({
  theme: z.enum(["light", "dark"]),
});

type SettingsType = z.infer<typeof settingsZod>;

/** Settings that are applied on the first load */
const defaultSettings = {
  theme: "light",
} satisfies z.infer<typeof settingsZod>;

export const getSettings = () => {
  const storedString = localStorage.getItem("settings");
  if (storedString === null) {
    storeSettings(defaultSettings);
    return defaultSettings;
  }

  try {
    return settingsZod.parse(JSON.parse(storedString));
  } catch (error) {
    console.error(
      "options threw error, code is continueing though. Error: " + error
    );
    localStorage.clear();
    storeSettings(defaultSettings);
    return defaultSettings;
  }
};

const storeSettings = (settings: SettingsType) =>
  localStorage.setItem("settings", JSON.stringify(settings));

export const changeSetting = (settings: Partial<SettingsType>) => {
  const changed = settingsZod.partial().parse(settings);

  const newSettings = getSettings();
  for (const _key in changed) {
    if (Object.prototype.hasOwnProperty.call(changed, _key)) {
      const key = _key as keyof SettingsType;
      const value = changed[key];
      if (value !== undefined) newSettings[key] = value;
    }
  }
  storeSettings(newSettings);
  eventTarget.dispatchEvent(new Event("change"));
};

const eventTarget = new EventTarget();

export const useSettings = () => {
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const listener = () => {
      const newSettings = getSettings();
      setSettings(newSettings);
      if (newSettings.theme === "light")
        window.document.body.classList.remove("dark");
      else window.document.body.classList.add("dark");
    };

    eventTarget.addEventListener("change", listener);
    return () => eventTarget.removeEventListener("change", listener);
  }, [settings]);

  return [settings, changeSetting] as const;
};
