# devOpsFitnesz

A programom egy fitnesz klub foglalási rendszerét valósítja meg .A userek tudnak regisztrálni és belépni. Az admin képes usereknek edző státuszt adni. Vannak foglalkozások melyekhez tartozik egy edző és a userek tudnak rá jelentkezni(van váró lista is). Az admin tudja kezelni a usereket törölheti őket (önmagát nem tudja az admin).

Kiindulaskor a newman biztosít egy admin felhasználót username:admin , pw: asd123

Indításkor: docker-compose up --build ez felépíti a dockerfüggőségeket.

Program főbb részei:
  backend: node.js  
  frontend: angular
  adatbázis: mongodb

Toolok:
  prometheus
  grafana
  nginx 
  bind9
  postman/newman

Ha sikeresen lefut a build akkor a newman/postman az adatbázisba bejegyez egy admint, és leállítja magát.
A prometheus és grafana monitorozásra szolgál ami a node szervert figyelni, prometheus végzi az adatgyűjtést amit össze kötöttem a grafana-val ami pedig egy jól kezelhető vizualizációs felületet biztosít a beérkező adatoknak.
Minden docker-compose down --volumes után a grafana vizuális felületén összekell kapcsolni a prometheust. Grafana vizuális felületén : Connections -> Data sources -> prometheus  Prometheus server URL : http://prometheus:9090
Ezután a dashboardon lehet customizált grafikonokat létehozni PromQL-ek segíségével.

Megadok 2 ilyen PromQL: 

http_requests_total

avg_over_time(http_requests_total[5m])

