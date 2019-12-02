# Documentation for Grotto GS scripts

Scripts are on daily or weekly timers. Keys are stored separately from .gs files.

UA key must have its session extended every few months.

Insights are only available starting in 2017 when account was converted to enterprise.

Back data on followers is apparently not available.

Issues:

- media_object script still replicates some posts. Need an algorithm to read ids on spreadsheet to compare to ids pulled from API before calling for insights on each id.

- media_objects script has stopped successfully pulling and storing comments.  Now just pulls a dictionary with only gibberish.