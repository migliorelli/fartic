import HttpError from "@/errors/http.error";
import Theme from "@/interfaces/theme.interface";
import ThemeModel from "@/models/theme.model";
import { isEmpty } from "@/utils/util";
import { validateObjectId } from "@/validators/objectid.validator";
import { validateCreateTheme } from "@/validators/theme.validator";

class ThemeService {
  public model = ThemeModel;

  public async findAllThemes(): Promise<Theme[]> {
    const themes: Theme[] = await this.model.find();
    return themes;
  }

  public async findThemeById(themeId: string): Promise<Theme> {
    if (isEmpty(themeId)) throw new HttpError(400, "ThemeId is empty");
    if (!validateObjectId(themeId))
      throw new HttpError(400, "ThemeId is invalid");

    const theme: Theme | null = await this.model.findOne({ _id: themeId });
    if (!theme) throw new HttpError(409, "Theme doesn't exist");

    return theme;
  }

  public async createTheme(data: Omit<Theme, "_id">): Promise<Theme> {
    if (!validateCreateTheme(data))
      throw new HttpError(400, "Invalid theme data");

    const createdTheme = await this.model.create({
      ...data,
      name: data.name.toLowerCase(),
    });

    if (!createdTheme) throw new HttpError(500, "Error creating theme");

    return createdTheme;
  }

  public async addWordsToTheme(
    themeId: string,
    words: string[],
  ): Promise<Theme> {
    if (isEmpty(themeId)) throw new HttpError(400, "ThemeId is empty");
    if (!validateObjectId(themeId))
      throw new HttpError(400, "ThemeId is invalid");

    if (isEmpty(words)) throw new HttpError(400, "Words is empty");
    if (!Array.isArray(words))
      throw new HttpError(400, "Words is not an array");

    const theme = await this.model.findOne({ _id: themeId });
    if (!theme) throw new HttpError(409, "Theme doesn't exist");

    for (const word of words) {
      if (theme.words.includes(word.toLowerCase()))
        throw new HttpError(
          409,
          `Word "${word}" already exists in theme ${theme.name}`,
        );
    }

    theme.words = [...theme.words, ...words.map((word) => word.toLowerCase())];
    await theme.save();

    return theme;
  }

  public async removeWordsFromTheme(
    themeId: string,
    words: string[],
  ): Promise<Theme> {
    if (isEmpty(themeId)) throw new HttpError(400, "ThemeId is empty");
    if (!validateObjectId(themeId))
      throw new HttpError(400, "ThemeId is invalid");

    if (isEmpty(words)) throw new HttpError(400, "Words is empty");
    if (!Array.isArray(words))
      throw new HttpError(400, "Words is not an array");

    const theme = await this.model.findOne({ _id: themeId });
    if (!theme) throw new HttpError(409, "Theme doesn't exist");

    theme.words = theme.words.filter((word) => !words.includes(word));
    await theme.save();

    return theme;
  }

  public async deleteThemeById(themeId: string): Promise<Theme> {
    const deletedTheme: Theme | null =
      await this.model.findByIdAndDelete(themeId);

    if (!deletedTheme) throw new HttpError(409, "Theme doesn't exist");

    return deletedTheme;
  }
}

export default ThemeService;
