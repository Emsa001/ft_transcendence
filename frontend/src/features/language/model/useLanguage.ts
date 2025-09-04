import { useLocalStorage } from "react";
import en from "../../../languages/en";
import pl from "../../../languages/pl";
import slangs from "../../../languages/slangs";

type Translation = typeof en;
type DotPrefix<T extends string, P extends string> = T extends ""
    ? ""
    : `${P}.${T}`;

type DotNestedKeys<T> = T extends object
    ? {
          [K in keyof T & string]: T[K] extends object
              ? K | DotPrefix<DotNestedKeys<T[K]>, K>
              : K;
      }[keyof T & string]
    : "";

type DeepValue<T, K extends string> = K extends keyof T
    ? T[K]
    : K extends `${infer Head}.${infer Rest}`
      ? Head extends keyof T
          ? DeepValue<T[Head], Rest>
          : never
      : never;

export const useLanguage = () => {
    const [language] = useLocalStorage("language", "en");

    const getText = <K extends DotNestedKeys<Translation>>(
        key: K
    ): DeepValue<Translation, K> => {
        const keys = key.split(".");
        let source;
        if (language === "en") {
            source = en;
        } else if (language === "pl") {
            source = pl;
        } else {
            source = slangs;
        }

        return keys.reduce((obj, k) => obj?.[k], source as any);
    };

    return {
        getText,
    };
};
