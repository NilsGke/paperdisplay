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

export const storeSettings = (settings: SettingsType) =>
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
};
