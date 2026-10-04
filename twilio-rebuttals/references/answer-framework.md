# Five-beat answer framework

Every rebuttal is exactly five sentences:

1. **Acknowledge.** Show the question is fair or important ("That's the right first question...").
2. **Answer directly.** The headline answer in one sentence. If time is short, sentences 1-2 must stand alone.
3. **Evidence.** A specific: a Twilio mechanism (Lookup, Messaging Service, status callbacks, X-Twilio-Signature, fallback URLs, ConversationRelay, Event Streams), a sourced number, or a published customer result.
4. **Honest trade-off.** Name the caveat, risk, or what is not done yet. Evaluators reward candor more than polish.
5. **Tie back or check in.** Connect to the asker's goal or propose the next step ("Can we agree on the pilot today?").

## Example

**Q (VP Engineering): Why doesn't a 201 mean the message was delivered?**

Because the REST call and the delivery are two separate events. A 201 Created means Twilio accepted the request and queued the message or call, nothing more. Delivery is reported later through status callbacks, moving through statuses like sent, delivered, or failed. My dashboard treats queued as pending until a callback confirms the outcome. In production, reporting delivered on a 201 would overstate your confirm rate, so we only count confirmed callbacks.

## Accuracy guardrails

- Pricing, SLAs, support tiers, approval timelines: defer to the account executive or current docs.
- HIPAA: say "HIPAA-ready with a BAA on eligible products," never "HIPAA compliant out of the box."
- A2P 10DLC: unregistered traffic is blocked (error 30034); throughput depends on brand type and trust score.
- WhatsApp: business-initiated messages need approved templates; production senders need a verified Meta business.
- Always separate live, simulated, and sandbox components explicitly.
