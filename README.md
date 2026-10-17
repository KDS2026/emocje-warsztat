# EMOCJE — warsztat o dezinformacji

Aplikacja do prowadzenia warsztatu dla uczniów, w dwóch blokach po 45 minut.

56 kolejnych plansz, cztery krótkie filmy, archiwalne nagrania dotyczące 5G i zamieszek po ataku w Southport, głosowanie kartonikami, ręcznie uruchamiane minutniki i ćwiczenia w podgrupach. Odpowiedzi odsłania prowadzący. Długi film „Anatomia spisku: 5G i pandemia” znajduje się w „Materiałach +”, poza podstawowym planem.

Szkolna symulacja otwiera warsztat, następnie pojawiają się mechanizmy i rzeczywiste kazusy. Rozwiązanie oraz pełne omówienie szkolnej historii są po przerwie. Pierwszy post na forum zawiera powiększany zrzut fikcyjnej wiadomości Oli.

## Uruchomienie

Strona: https://kds2026.github.io/emocje-warsztat/

Przyciski Wstecz i Dalej przełączają odsłony. Kliknięcie EMOCJE otwiera mapę warsztatu. Filmy uruchamia się przyciskiem odtwarzania. Aplikacja nie wymaga logowania.

„Start lekcji 1” uruchamia niezależny zegar do 45:00. Obok planowanej minuty widoczny jest w nawiasie czas rzeczywisty, np. `10′ (12:34)`. Liczenie trwa podczas filmów, ćwiczeń, omówień i pracy w innej karcie; po powrocie czas wynika z zapisanego momentu startu, a nie liczby odświeżeń zegara. Odświeżenie strony w tej samej karcie zachowuje zegary, jeśli przeglądarka pozwala korzystać z pamięci sesji. Niebieski czas oznacza zgodność z przedziałem danej planszy (od jej minuty do następnej późniejszej minuty w tej samej lekcji), czerwony — opóźnienie, zielony — zbyt szybkie tempo.

Po planszy PRZERWA należy nacisnąć „Start lekcji 2”. Drugi zegar zaczyna od zera i również kończy na 45:00. Zegary nie mają pauzy i nie zerują się przy przełączaniu plansz. Przycisk ↺ rozpoczyna nowe zajęcia przez wyzerowanie obu zegarów, po potwierdzeniu. Minutniki ćwiczeń pozostają niezależne.

Można również pobrać całe repozytorium i otworzyć `index.html` w przeglądarce. Należy zachować katalog `assets`.

## Publikacja

GitHub Pages udostępnia katalog główny gałęzi `main`. Filmy warsztatowe i grafiki są częścią aplikacji. Dwa nagrania archiwalne Euronews są odtwarzane z serwera wydawcy i wymagają internetu; nie są dołączone do repozytorium. Nagranie z Londynu zatrzymuje się po 45 sekundach. Nie ma tu podcastu ani materiałów kursu dla prowadzącego.

Znaki organizacji i informacja o dofinansowaniu są wyświetlane w formie dostarczonego pasa logotypów.
