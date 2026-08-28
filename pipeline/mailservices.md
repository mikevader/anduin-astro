---
status: drafted
grilled: 2026-08-28
drafted: 2026-08-28
---

# Mailservices - capture record

Captured 2026-08-28 during the Iteration 1 exit test of the anduin-hugo harness.
Kept outside the harness repo on purpose: drafts and captures are not repo files.

Three parts: the raw dump as it was written, the interrogation verbatim, and the
resulting draft.

---

## 1. Raw dump (as written)

```
# Mailservices
Ich habe verschiedene Mailclients bzw Services ausprobiert um bei Heinzlix einzusetzen.
In früheren Projekten habe ich Sendgrid eingesetzt aber ich wollte wechseln.
Die Lösungen waren u.a: Mailtrap, Sendpit, Mailpit (ich habe noch mehr angeschaut
vormals als SMTP Relay Option, resultate hier:
https://mikevader.github.io/k3s-cluster-infra-apps/platform/mail-service/?h=mail).
Mailpit ist vor allem eine Superlösung um Mailversand zu testen.
Mailtrap funktioniert super um zu testen aber auch den Effektiven Versand zu machen.
Hatte einzig Probleme bei der Produktivsetzung mit der Config.
```

## 2. Interrogation (verbatim, German - per ADR-0002)

**F: Was genau ist bei der Produktivsetzung schiefgelaufen?**
> Der Fehler lag daran, dass meine Config die InboxId immer gesetzt hat. Meine Annahme
> war, dass wenn ich Sandbox=false setzte dies egal ist. Aber man darf dann keine Inbox
> setzen (auch nicht auf nil).

**F: "Sendpit" - Tippfehler oder echtes Produkt?**
> Sendpit ist ein echter Service und scheint noch echt cool zu sein und mit einem
> Free-Tier. Allerdings eher aufs Testing fokusiert und weniger auf Produktiven
> einsatz. Darum hab ich den Service nicht weiter verfolgt.

**F: Warum weg von Sendgrid?**
> Nope der auslaufende FreeTier war entscheidend und dass man mehr oder weniger schon
> schnell relativ viel Zahlen müsste.

**F: Heinzlix - was ist das, darf der Name publik sein?**
> Heinzelix ist der definitive Name von Heinzelmann. Man darf dies nennen da
> öffentlicher Service bzw Webseite.

**F: Stand heute?**
> Der Einsatz im Cluster ist weniger relevant, bzw ist dokumentiert auf der Seite wo
> ich dir gelinkt habe. Aber aktuell setze ich in der Entwicklung Mailpit lokal ein um
> zu testen und dann Mailtrap.

**F: Wann war das?**
> Die ursprüngliche Evaluation für den Relay bzw Cluster war 26. Jan 2026. Der Einsatz
> von Mailtrap im Heinzelix wo jetzt zusammen mit Mailpit relevant ist, war 15. Mai 2026.

**F: Der eine Satz für Future-You?**
> Sendpit ist eine gute Variante neben Mailtrap für Testing und hat vielleicht potential
> für Mailversand in der Zukunft

### Nachfassen, nachdem das Repo widersprochen hat

Der CHANGELOG von `heinzelmann` zeigte zwei Fixes am 11.08.2026 statt einem:
`97513e7` (inbox_id weglassen) und `33cbba2` (MAILTRAP_SANDBOX auf Boolean casten).
Der zweite kam in der Schilderung nicht vor. Daraufhin gefragt:

**F: Was war das Symptom?**
> Das Symptom war, dass die Mails immer noch in der Sandbox landen, es gab keinen Fehler.

**F: Hat die inbox_id allein es repariert, oder erst der Boolean-Cast?**
> Du hast recht, der Echte Fehler war string vs boolean.

**F: Wie lange hat es gekostet?**
> Jup hat mich relativ lange gekostet aber in Zahlen weiss ich dies nicht mehr ... ist
> auch nicht so relevant

**Das ist der Grund, warum ADR-0005 existiert.** Ohne den Blick ins Repo wäre die
falsche Lehre publiziert worden: dass die inbox_id die Ursache war.

## 3. Sources

- Eigene Evaluation: https://mikevader.github.io/k3s-cluster-infra-apps/platform/mail-service/?h=mail
- Commits: `mikevader/heinzelmann` 97513e7, 33cbba2 (beide 2026-08-11)
- Config: `config/environments/production.rb`, mailtrap gem ~> 2.13.0

## 4. Open before publishing

- Resource-/Link-Liste am Schluss fehlt noch. Wartet auf ein Blog-Post-Template
  (Iteration 3).
- Der Vergleich soll von der mkdocs-Seite gelöscht werden, sobald der Post live ist -
  dort bleibt nur noch der Teil unterhalb von `Architecture`.

---

## 5. Draft

# Mailtrap kept sending to the sandbox (because "false" is truthy)

For Heinzelix I needed a mail service I could use for testing and for the real
sending. In earlier projects I used Sendgrid, but the free tier expires after 60 days
and after that you pay relatively much relatively fast. So I looked at what else is
out there.

Three criteria: is there a free tier, does it stay free, and how many mails do I get.

| Service | Free tier | Notes |
|---|---|---|
| Mailtrap | 1'000 mails/month, permanent | testing and production on the same platform |
| Resend | 3'000 mails/month | modern API |
| Brevo | 300 mails/day, permanent | most volume of the permanent tiers |
| Sendgrid | expires after 60 days | |
| Postmark | expires after 30 days | |
| Mailgun | none | |

The numbers are from January 2026. Providers change them, so check before you trust
the table.

Sendpit is a real service and looks good, with a free tier as well. But it is focused
on testing and less on productive sending, so I did not follow it further.

Mailtrap won because the free tier stays, and because testing and production run on
the same platform with the same SMTP credentials. Locally I use Mailpit in
docker-compose, which catches everything and can relay to Mailtrap when I want the
mail to actually leave.

That was the evaluation on 26 January 2026. Mailtrap went into Heinzelix on
15 May 2026.

## The part that cost me

The Rails config is three lines and it worked fine while testing:

```ruby
config.action_mailer.delivery_method = :mailtrap
config.action_mailer.mailtrap_settings = {
  api_key: ENV.fetch("MAILTRAP_API_KEY", nil),
  sandbox: ENV.fetch("MAILTRAP_SANDBOX", true),
  inbox_id: ENV.fetch("MAILTRAP_INBOX_ID", nil)
}
```

In production the mails kept landing in the sandbox. No error, no failed delivery,
nothing in the log. They just did not go out.

My first idea was the `inbox_id`. With sandbox off you must not set an inbox, and my
config always set it, even when the variable was empty. So I made the key disappear
from the hash instead of setting it to nil:

```ruby
**({ inbox_id: ENV["MAILTRAP_INBOX_ID"] } if ENV["MAILTRAP_INBOX_ID"].present?)
```

That did not fix it.

The real problem was one line above:

```ruby
sandbox: ActiveModel::Type::Boolean.new.cast(ENV.fetch("MAILTRAP_SANDBOX", true)),
```

Environment variables are strings. `ENV.fetch("MAILTRAP_SANDBOX", true)` gives back the
string `"false"`, and in Ruby the string `"false"` is truthy. So sandbox was never off,
no matter what the deployment said.

There was no error message anywhere, and that is why it took me relatively long. You
check the credentials, the deployment, the sender domain. A string that is truthy is
not where you look first.

Whether the `inbox_id` would have been a problem as well, once sandbox was really off,
I did not test. The change stays in either way.

Sendpit stays on my list. For testing it is a good variant beside Mailtrap, and maybe
it will be an option for sending some day.
