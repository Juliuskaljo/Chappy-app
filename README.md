KNOWN BUGS:

Cant see usernames but that is on the way!

FEATURES:

Register account

Create channels as user

Send pictures

React with emojis

1. GET /api/channels  
   Method: GET  
   URL: /api/channels  
   Params: Inga parametrar.  
   Body: Inget body behövs.  
   Response:
    - 200 OK: Lista med kanal-objekt.
    - 404 Not Found: Om inga kanaler finns i databasen.

---

2. GET /api/channels/:id  
   Method: GET  
   URL: /api/channels/:id  
   Params:
    - id (required): Kanalens unika ID.  
      Body: Inget body behövs.  
      Response:
    - 200 OK: Ett matchande kanal-objekt.
    - 404 Not Found: Om inget kanal-dokument med rätt id finns.

---

4. POST /api/login  
   Method: POST  
   URL: /api/login  
   Params: Inga parametrar.  
   Body: Inloggningsuppgifter (JSON) som innehåller användarnamn och lösenord, eller för gäst-login (endast användarnamn "guest").  
   Response:
    - 200 OK: Om inloggningen är framgångsrik, returneras en JWT-token och användarens ID.
    - 401 Unauthorized: Om användarnamn eller lösenord är felaktiga.
    - 500 Internal Server Error: Om det uppstår ett serverfel.

---

6. POST /api/send/guest  
   Method: POST  
   URL: /api/send/guest  
   Params: Inga parametrar.  
   Body: Gäst-meddelande-objekt som ska skickas till en kanal (JSON), med ett innehåll och kanal-ID.  
   Response:
    - 200 OK: Om gäst-meddelandet skickades framgångsrikt.
    - 400 Bad Request: Om det saknas nödvändiga parametrar eller kanal-ID är ogiltigt.
    - 401 Unauthorized: Om användaren inte är inloggad.
    - 403 Forbidden: Om token är ogiltig eller utgången.

---

7. POST /api/send  
   Method: POST  
   URL: /api/send  
   Params: Inga parametrar.  
   Body: Meddelande-objekt som ska skickas till en kanal (JSON), med ett innehåll och kanal-ID.  
   Response:
    - 200 OK: Om meddelandet skickades framgångsrikt.
    - 400 Bad Request: Om det saknas nödvändiga parametrar eller kanal-ID är ogiltigt.
    - 401 Unauthorized: Om användaren inte är inloggad.
    - 403 Forbidden: Om token är ogiltig eller utgången.

---

8. POST /api/dm/send  
   Method: POST  
   URL: /api/dm/send  
   Params: Inga parametrar.  
   Body: Direktmeddelande-objekt (JSON), med ett innehåll och mottagar-ID.  
   Response:
    - 200 OK: Om DM-meddelandet skickades framgångsrikt.
    - 400 Bad Request: Om det saknas nödvändiga parametrar eller mottagar-ID är ogiltigt.
    - 401 Unauthorized: Om användaren inte är inloggad.
    - 403 Forbidden: Om token är ogiltig eller utgången.

---

9. GET /api/dm/:receiverId  
   Method: GET  
   URL: /api/dm/:receiverId  
   Params:
    - receiverId (required): Mottagarens unika ID.  
      Body: Inget body behövs.  
      Response:
    - 200 OK: Lista med direktmeddelanden mellan användaren och mottagaren.
    - 400 Bad Request: Om receiverId är ogiltigt.
    - 401 Unauthorized: Om användaren inte är inloggad.
    - 403 Forbidden: Om token är ogiltig eller utgången.
    - 500 Internal Server Error: Om det uppstår ett serverfel.

---

10. GET /api/messages/:channelId  
    Method: GET  
    URL: /api/messages/:channelId  
    Params:

-   channelId (required): Kanalens unika ID.  
    Body: Inget body behövs.  
    Response:
-   200 OK: Lista med meddelanden från angiven kanal.
-   400 Bad Request: Om channelId är ogiltigt.
-   404 Not Found: Om kanalen inte finns.
-   500 Internal Server Error: Om det uppstår ett serverfel.

---

11. GET /api/users  
    Method: GET  
    URL: /api/users  
    Params:

-   loggedInUserId (required): ID för den inloggade användaren.  
    Body: Inget body behövs.  
    Response:
-   200 OK: Lista med alla användare.
-   400 Bad Request: Om loggedInUserId saknas.
-   500 Internal Server Error: Om det uppstår ett serverfel.

---

12. GET /protected  
    Method: GET  
    URL: /protected  
    Params: Inga parametrar.  
    Body: Inget body behövs.  
    Response:

-   200 OK: Om användaren är autentiserad och information om användaren returneras.
-   401 Unauthorized: Om ingen token skickas eller token är ogiltig.
-   403 Forbidden: Om användaren inte har behörighet.
-   404 Not Found: Om användaren inte finns i databasen.
-   500 Internal Server Error: Om det uppstår ett serverfel.
