import hunspell
from texttools.settings import BASE_DIR
from os.path import join as join_path

spellchecker = hunspell.HunSpell(join_path(BASE_DIR, "uz-hunspell/uz-lat.dic"),
                                 join_path(BASE_DIR, "uz-hunspell/uz-lat.aff"))

spellcheckercyr = hunspell.HunSpell(join_path(BASE_DIR, 'uz-hunspell/uz-cyr.dic'),
                                    join_path(BASE_DIR, 'uz-hunspell/uz-cyr.aff'))


def check(suz, cyr=False):
    if not cyr:
        return spellchecker.spell(suz)
    return spellcheckercyr.spell(suz)


def suggestions(suz):
    return spellchecker.suggest(suz)

