import hunspell

spellchecker = hunspell.HunSpell('/home/samandar/samandar/airiuz/tilim.uz/Backend/uz-hunspell/uz-lat.dic',
                                 '/home/samandar/samandar/airiuz/tilim.uz/Backend/uz-hunspell/uz-lat.aff')

spellcheckercyr = hunspell.HunSpell('/home/samandar/samandar/airiuz/tilim.uz/Backend/uz-hunspell/uz-cyr.dic',
                                 '/home/samandar/samandar/airiuz/tilim.uz/Backend/uz-hunspell/uz-cyr.aff')

def check(suz, cyr=False):
    if not cyr:
        return spellchecker.spell(suz)
    return spellcheckercyr.spell(suz)

def suggestions(suz):
	return spellchecker.suggest(suz)
