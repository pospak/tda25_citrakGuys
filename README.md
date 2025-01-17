
# CitrakGuys
Náš tým má dva členy - ([Michal Pospíšil (pospak)](https://github.com/pospak) a [Štěpán Ptáčník (famek)](https://github.com/F4m3k)) a pochází z Boskovické Střední školy André Citroena.
# Aplikace pro Think different Academy (TdA)
Aplikace využívá tyto technologie:
- Framework Express
- JavaScript pro backend
- Sqlite3 pro databázi
- Šablonovací systém Pug v kombinaci s CSS pro frontend.

Spouštění aplikace zajišťuje dockerfile.

## Co aplikace umí?
Naše alikace obsahuje jednoduché a interaktivní prostředí pro učení se logického uvažování pomocí piškvorkových úloh. 

Uživatel má stále k dispozici navigační menu, pomocí kterého si může:
- Vytvořit novou hru piškvorek
- Zobrazit stránku všech her
- Vrátit se zpět na hlavní stránku aplikace

### Uložené hry
V sekci "Uložené hry" jde jednoduše přistupovat k uloženým hrám, které jde po otevření dále editovat, nebo hrát.  

#### Herní stránka
Na stránku se hrou se uživatel dostane po kliknutí na konkrétní hru v sekci "Uložené hry". 

Na stránce se nachází:
- Informace o hře jako:
    - Název uložené hry (jména hráčů)
    - Datum a čas vytvoření
    - Datum a čas poslední aktualizace
    - Stav hry
    - Herní obtížnost
    - Tlačítko pro úpravu informací
    - Tlačítko pro smazání hry z databáze
- Interaktivní herní pole 15x15 polí pro hru dvou hráčů
- Tlačítko pro uložení rozehrané hry

### Patička aplikace
V aplikaci je po celou dobu přístupná patička, která obsahuje mimo jiné tyto odkazy:
- Odkaz na facebookovou stránku TdA
- Odkaz na YouTube kanál Student Cyber Games
- Odkaz na instagramový profil TdA
- Odkaz na stránky naší školy
- Odkaz na hlavní stránky TdA
- Odkaz na stránku s nedokončenými nebo experimentálními funkcemi aplikace

## API
Naše aplikace poskytuje veřejné REST API pro nahrávání, čtení, úpravu a mazání uložených her.
API je k dispozici na cestě /api/v1/games

Děkujeme za pozornost
-
