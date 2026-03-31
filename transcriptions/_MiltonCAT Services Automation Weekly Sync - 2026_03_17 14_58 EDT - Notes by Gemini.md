# 📝 Notes

Mar 17, 2026

##  MiltonCAT Services Automation Weekly Sync

Invited [Lucas Inacio Luz](mailto:lucas.inacio@rapidcanvas.ai) [Ray Hsu](mailto:ray@rapidcanvas.ai) [Davis Gallagher](mailto:davis@rapidcanvas.ai) [Herbert Gomes Miranda](mailto:herbert@rapidcanvas.ai) [Dailey, Tim](mailto:tim_dailey@miltoncat.com) ~~[Fuge Zou](mailto:fuge@rapidcanvas.ai)~~

Attachments [ MiltonCAT Services Automation Weekly Sync](https://www.google.com/calendar/event?eid=NGhnbDRtcWRxYWk0NDRyNzFnM2ZscGRkNHBfMjAyNjAzMTFUMTgwMDAwWiBkYXZpc0ByYXBpZGNhbnZhcy5haQ) [Notes by Gemini](https://docs.google.com/document/d/1WZqTnBRONAAYq9xwIDLyeEL5xgI1Q-XEAT6npt4O5cI/edit?usp=meet_tnfm_calendar) 

Meeting records [Transcript](?tab=t.1inb2amwy3wo) 

### Summary

VP of Service introduced for system buy-in and review of the 3-tiered quote generation system with discussions on data needs and mobile application flow.

**Data Access and Service VP**  
The team confirmed read access to AX will provide 12 years of data, but additional exports were committed to for immediate testing. Josh Gaynor, VP of Service, was introduced as a key stakeholder interested in using the tool for quote generation.

**Three-Tiered Quote Logic**  
The quote generation system uses a 3-tiered logic prioritizing standard jobs, then work order history with confidence scoring, and finally similarity scoring for low-confidence quotes. The team agreed to use standard rates for quoting to simplify implementation and committed to providing the CAT builder file.

**Mobile Flow and Integration**  
The preferred user flow dictates that PSSRs generate quotes via the mobile UI and push the record to AX to create the CSR. A meeting was scheduled for Thursday to finalize AX integration specifications and column names.

### Details

* **Parts Data and AX Read Access**: Davis Gallagher thanked Tim Dailey for sending the parts data, but requested an expansion beyond October 2025 to increase the effectiveness of the similarity scoring for the proof of concept. Tim Dailey confirmed that once they have read access to AX, they will have 12 years of data, and they committed to providing additional exports for November and December ([00:01:51](#00:01:51)).

* **Introduction of VP of Service**: Tim Dailey introduced Josh Gaynor, the VP of Service and VP of Product Support, who has a vested interest in the tool. Josh Gaynor's team will use the tool for quote generation and identifying gaps for standard job creation. Davis Gallagher provided an introduction to the system's quote generation logic, as Josh Gaynor wanted a quick demo ([00:04:26](#00:04:26)).

* **Three-Tiered Quote Generation System**: Davis Gallagher explained that quote generation for any job combination (model, serial prefix, job code, component code) operates on a three-tiered system. The first tier is the standard job, which automatically generates a 100% confidence quote ([00:05:11](#00:05:11)).

* **Work Order History and Confidence Scoring**: The second tier uses work order history when no standard job exists, generating a confidence score based on the volume of work orders for that combination ([00:06:06](#00:06:06)). Confidence is also measured by analyzing the variance in price across work orders using the coefficient of variance, with scores above 0.5 resulting in a lower confidence rating ([00:06:58](#00:06:58)).

* **Similarity Scoring for Low Confidence Quotes**: The third tier, similarity scoring, is used if there is only one work order, a low confidence level, or no previous work orders. This method boosts confidence by looking at other jobs with similar parts used, labor hours, parts quantity, and minimal variance in costs, which is where the broader parts data is needed ([00:06:58](#00:06:58)). The system will also default to similarity scoring if the confidence level is below 30% and the system believes it can generate a more accurate quote ([00:07:54](#00:07:54)).

* **Updating Parts Pricing and CAT Builder File**: They discussed updating the system to reference the most recent parts price rather than the average price. Tim Dailey committed to providing a CAT builder file and coordinating with Cat to ensure the team gets permission to use it ([00:08:50](#00:08:50)).

* **Demonstration of Quote Generation Types**: Davis Gallagher provided a quick demo showing the three types of quotes the system can generate: a 100% confidence quote from a standard job, a medium confidence quote from multiple work orders with minimal variance, and a low confidence quote from only one work order where similarity scoring is needed ([00:09:25](#00:09:25)). Tim Dailey noted the importance of the similarity logic, especially since the tool needs to work for non-CAT equipment ([00:11:50](#00:11:50)).

* **Displaying History for Standard Jobs**: Josh Gaynor inquired about seeing work order history alongside standard jobs for validation purposes, specifically to compare the standard job's price against the range indicated by work order history ([00:13:31](#00:13:31)). Tim Dailey agreed that the analytics should show the average cost from work orders to identify potential standard jobs that may be using the wrong labor hours ([00:14:14](#00:14:14)).

* **Clarification on Labor Hours and Pricing**: Josh Gaynor raised a question about the source of the labor hour calculation, noting a discrepancy with their internal rates ([00:16:50](#00:16:50)). Tim Dailey explained that the pricing for history should reflect current rates, not historical prices, due to rapid inflation and offered to provide the sale rate table to convert labor hours to current pricing ([00:17:53](#00:17:53)). The team agreed to use standard rates for quoting to simplify implementation ([00:18:31](#00:18:31)).

* **AX Table Names and Column Specification**: Davis Gallagher proposed meeting separately with Tim Dailey and an additional person to finalize the correct table and column names for the AX integrations. Tim Dailey proposed scheduling this meeting for Thursday ([00:19:06](#00:19:06)).

* **Mobile UI Demonstration and User Flow**: Davis Gallagher presented the mobile UI, which mirrors the desktop app's functionality for generating quotes ([00:20:00](#00:20:00)). They determined that the preferred user flow is for the Product Support Service Representatives (PSSR) to generate a quote using the mobile app and push it directly to AX, creating the Customer Service Record (CSR) ([00:20:52](#00:20:52)).

* **Mobile App Access and Offline Functionality**: Davis Gallagher noted that the mobile app will likely be accessed through a link via Safari on the phone, within the Rabbit Canvas website. Tim Dailey confirmed that the ability for the app to function and generate a quote without service (offline functionality) is a necessary feature ([00:21:54](#00:21:54)).

* **Access for User Testing**: Josh Gaynor requested access to the test link to interact with the system using real data. Davis Gallagher committed to adding Josh Gaynor to the workspace immediately after the call ([00:22:40](#00:22:40)).

* **Similarity Score Limitations During Testing**: Davis Gallagher cautioned that the similarity scores currently generated might not be fully accurate because the team still lacks the complete parts data and parts quantity for all work orders ([00:23:35](#00:23:35)). Tim Dailey acknowledged that the limited AX access is a current holding point and confirmed that the focus is on achieving read access first, with write access to follow ([00:24:18](#00:24:18)).

* **Scheduling of AX Specification Meeting**: Tim Dailey and Davis Gallagher scheduled a meeting for Thursday from 10:00 to 11:00 Eastern to finalize the AX integration specification ([00:25:07](#00:25:07)).

* **Strategy for Write Access to AX**: Davis Gallagher discussed the expected two-month delay for write access to AX and proposed an interim solution: exporting generated quotes into a CSV file for SFTP upload back to AX ([00:25:07](#00:25:07)). Tim Dailey advised against using the push functionality or a stopgap solution for write access due to the fragile state of the current AX system ([00:26:51](#00:26:51)).

* **Success Criteria and UAT Timeline Review**: Davis Gallagher requested that Tim Dailey review a document outlining the success criteria, User Acceptance Testing (UAT) timeline, and potential go-live date, and to provide a list of additional UAT testers once more data is available ([00:27:41](#00:27:41)). Tim Dailey committed to providing feedback by the Thursday meeting ([00:28:33](#00:28:33)).

* **AX Integration Escalation and Caterpillar Data**: Ray Hsu inquired about the escalation of the AX integration delays; Tim Dailey confirmed that the issue is visible to Doug and has been escalated to their CEO, Scott Simon, to establish a realistic timeline ([00:29:17](#00:29:17)). Regarding the Caterpillar data, Tim Dailey expects an update next week, as Adam from the GCSS team is currently working on it ([00:30:07](#00:30:07)).

* **Future CAT Dealer Meeting**: Ray Hsu inquired about the next CAT dealer meeting for showcasing the tool. Tim Dailey indicated that the most important meeting for presenting the working model is a dealer-run dealer solution meeting scheduled for September ([00:30:57](#00:30:57)). Tim Dailey mentioned that they will look into any other meetings, such as one potentially in June ([00:32:00](#00:32:00)).

### Suggested next steps

- [ ] Tim Dailey will read the success criteria, UAT timeline, and potential go live document and provide feedback on alignment by the Thursday meeting.  
- [ ] Tim Dailey will try to give Davis Gallagher November and December parts data exports from AX.  
- [ ] Tim Dailey will get the CAT builder file, review it, and then work with Cat to ensure the group gets permission to use it.  
- [ ] Lucas Inacio Luz will take a look after the meeting to ensure how the labor hours were calculated.  
- [ ] Davis Gallagher will add an implementation to show average labor cost on the analytics piece for standard jobs.  
- [ ] Tim Dailey will give the labor table and read access to the labor table over to Davis Gallagher and the group.  
- [ ] Davis Gallagher will add Josh gaynor to the workspace and send the link right after the call.  
- [ ] Davis Gallagher and Tim Dailey will meet on Thursday from 10 to 11 Eastern to get the AX integration spec done and Tim Dailey will bring someone else to help get the table names.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*Please provide feedback about using Gemini to take notes in a [short survey.](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=rFVzDhTvWhkck7cSuh78DxIVOAIIigIgABgBCA&detailid=standard)*

# 📖 Transcript

Mar 17, 2026

##  MiltonCAT Services Automation Weekly Sync \- Transcript

### 00:00:00

   
**Lucas Inacio Luz:** Are  
**Davis Gallagher:** There it is. All right. 10\.  
**Ray Hsu:** Hey  
**Davis Gallagher:** Hey,  
**Ray Hsu:** guys.  
**Davis Gallagher:** red.  
**Tim Dailey:** Hey guys.  
**Lucas Inacio Luz:** hating.  
**Davis Gallagher:** Good afternoon.  
**Tim Dailey:** Good afternoon.  
**Davis Gallagher:** How's it going?  
**Tim Dailey:** Good. Josh is invited to this one, correct?  
**Davis Gallagher:** Uh, I believe I saw you forwarded over to Josh. Yes.  
**Tim Dailey:** All right,  
**Davis Gallagher:** Let me double  
**Tim Dailey:** we'll give him a minute and I'll see what the hell he's up  
**Davis Gallagher:** check.  
**Tim Dailey:** to.  
**Davis Gallagher:** Yep. Josh accepted the invite on Friday, so he should have it.  
**Tim Dailey:** I'll text him right now.  
**Davis Gallagher:** Cool. How's the start of the week going, Tim?  
**Tim Dailey:** It feels like I've been working this week for nine days already. So, that's how the starts going.  
**Davis Gallagher:** Oh boy.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** Busy.  
**Tim Dailey:** It's just we're we're slammed with ERP and stuff like that. It's just it's a big project.  
**Davis Gallagher:** Yeah. Yeah, I can imagine.  
   
 

### 00:01:51 {#00:01:51}

   
**Davis Gallagher:** Uh, by the way, thanks for sending over that that parts data. Um,  
**Tim Dailey:** You're  
**Davis Gallagher:** was was super helpful. did did have a quick question on that because and I'll I'll explain how this feeds into the logic as well,  
**Tim Dailey:** welcome.  
**Davis Gallagher:** but I saw that it was for the month of October 2025\. Um I think ideally,  
**Tim Dailey:** Yep.  
**Davis Gallagher:** and I know that AX is a big pain to export from, uh if we could expand that to be a little bit larger, that'd be great because part of the similarity score is using is it's joining on that CSR record to gather the parts used for that job and the quantity.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** And when we get the similarity scoring, especially for all the work order history we have, we want to cross reference as much of that as we can.  
**Tim Dailey:** Once you have your read access to AX,  
**Davis Gallagher:** So,  
**Tim Dailey:** you're going to have uh 12 years of data for for the proof of concept.  
**Davis Gallagher:** perfect. Okay,  
**Tim Dailey:** Do you need more Davis?  
   
 

### 00:02:36

   
**Davis Gallagher:** cool.  
**Tim Dailey:** Because that th they those extracts do take a while.  
**Davis Gallagher:** I I think it'd be nice to have more just to pressure test a little bit more some of the similarity  
**Tim Dailey:** Okay.  
**Davis Gallagher:** scoring because like I said,  
**Tim Dailey:** What are you looking for? How many How many more  
**Davis Gallagher:** Um,  
**Tim Dailey:** months  
**Davis Gallagher:** honestly, as much as is possible without breaking the computer or taking forever would be ideal for  
**Tim Dailey:** you You basically got that. But I can give you multiple exports.  
**Davis Gallagher:** me.  
**Tim Dailey:** So I I can give you um I'll try to give you November and December.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** Okay. Let me get that. Just give me one second.  
**Davis Gallagher:** Perfect.  
**Tim Dailey:** Um, get that going now or I will forget. Hey Josh,  
**Davis Gallagher:** Hey, good afternoon, Josh. I think you're on mute. There we go. Oh, can you can you speak one more time? I don't know if we can hear you. We can't hear  
   
 

### 00:03:27

   
**Tim Dailey:** can't hear you, Josh. Yeah, since it's we're not we're not a big Google's teams,  
**Davis Gallagher:** you.  
**Tim Dailey:** there's another thing that'll pop up and says to use your audio, whatever, Josh. Um, yeah, let me get that going for you, D.  
**Davis Gallagher:** Yeah, much appreciated. Thank you, Sam.  
**Tim Dailey:** Never  
**Josh gaynor:** How about now?  
**Herbert Gomes Miranda:** Yeah,  
**Davis Gallagher:** We can hear  
**Josh gaynor:** Yeah, I was going to say we don't use uh Google,  
**Davis Gallagher:** you.  
**Tim Dailey:** sound better.  
**Josh gaynor:** so I had to monkey around.  
**Davis Gallagher:** Yeah, we uh it took me a while to get used to using Google Meet. I was a teams only for my first three and a half years and uh it's an adjustment.  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** So, appreciate uh appreciate you hopping on. Sorry about  
**Tim Dailey:** as you know when you guys put stuff in the chat every single time I said where the hell is that?  
**Davis Gallagher:** that.  
**Tim Dailey:** So you guys know I I struggle with it myself. So um real quick intro if you guys haven't met Josh I think you have.  
   
 

### 00:04:26 {#00:04:26}

   
**Tim Dailey:** Josh is our VP of service has a big vested interest in this. He's also our VP of product support. So he's kind of both sides of this tool where um his product support team will use it for the quote generation and then for the gaps and standard job creation his team will also use that for for that to find out where can we do the the gaps themselves. So um been talking to Josh pretty excited about the tool and he kind of wanted to get a a quick demo. So Davis I don't know if you want to just start off with that um and then Josh can drop if if he needs to and we can handle some more of the minutia.  
**Davis Gallagher:** Yeah. Yeah, for sure. Happy to do that. Um, and Josh, I think we met in January when I went on site, so good to see you again.  
**Josh gaynor:** How you doing?  
**Davis Gallagher:** Not too bad. Not too bad.  
**Josh gaynor:** All  
**Davis Gallagher:** Um before I I get into the platform a little bit, I actually just want to talk about kind of the the big three things that go into the quote generation,  
   
 

### 00:05:11 {#00:05:11}

   
**Josh gaynor:** right.  
**Davis Gallagher:** which is the data that we pulled and then how that affects the confidence levels and what is pulled through as a generated quote. U because I think that all kind of set the context for how the system is working. I'll show three different examples as well. Um but I think from a high level, the way that the data that we got was obviously Tim, you gave us the all the standard jobs uh from AX. We also got 10 years worth of work order history and now we've got a month of parts data. And so all three of those are kind of put together. And essentially the way that we are generating a quote for each combination of job and the combination is model, serial prefix, job code, component code. When a user puts in those four, there's a three tiered system generated quote. The first tier is a standard job. If there's a standard job, 100% confidence automatically pulling from the standard job. No questions asked. We're good there.  
   
 

### 00:06:06 {#00:06:06}

   
**Davis Gallagher:** So that's pretty simple. The second one is work order history. And so when a work when we put in a combination of those four attributes for a particular uh quote uh we'll essentially look back to all the the if there's no standard jobs exist, we'll look back to all the work orders associated with that combination and we'll generate a confidence score that uh allows us to see how how confident we are in the quote. So what we'll do is we'll take all of the work orders associated with that particular combination and the base level of confidence is assigned by the volume of quotes or the volume of work orders that we have with that given combination. So something that we've only generated one work order for will have less confidence something that we've generated five for versus something we've generated 14 for. So the more records we have from work orders the the higher the baseline confidence score. The second thing we do is then filter uh is then I'm sorry uh kind of measure the variance between those different work orders.  
   
 

### 00:06:58 {#00:06:58}

   
**Davis Gallagher:** So if we have let's say four work orders and they are all wildly different across the three dimensions that go into price, we'll analyze what's called the coefficient of variance. If it's above 0.5, it'll get docked and lower the confidence in that generated quote. So taking the work order history, the baseline record number is the first layer of confidence. The second layer of confidence is variance. And then the third layer that goes into it is also kind of getting into the tier three of the quote generation waterfall is similarity scoring. And Tim, this is where the parts data comes in where essentially if we only have one work order or we have a really low  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** confidence level for a given quote because of the number of work orders, the variation our work orders, we'll kick back to say, can we look at other jobs that have uh the same parts used, the same amount of labor hours, the same quantity of parts used, and a minimal variance in what our costs are, and use that to boost the confidence of our quote.  
   
 

### 00:07:54 {#00:07:54}

   
**Davis Gallagher:** or if we don't have any previous work orders, use that as our basis of our quote. So, it's kind of a three- tiered system, which is standard jobs, work orders, and then similar uh similarity scoring based on similar work orders. Uh if we have uh minimal data on previously generated work orders or we don't have any data at all. So, it's kind of how the system works in general. Does that make sense? Cool. Cool. And the other thing I I'll flag too is in that tier 2 waterfall, even when we do have work orders, if our confidence level is below 30%, and the system believes that by using the similarity scoring, it can generate a more accurate quote, it'll kick back to the similarity scoring to generate the quote as well. And so it'll use similar jobs based on that the the parts data and our our labor data to create the quote. So that's kind of how the broader system works. Um, and then the other thing, Tim, that we're working on now is what you mentioned last week is we we obviously want to use the most recent parts price as our price in the quote.  
   
 

### 00:08:50 {#00:08:50}

   
**Davis Gallagher:** U, you'll see in the system it still references average, but we're implementing the the the quick it's a quick fix just to reference the most recent price part. Uh, and that's kind of why having that broader job table or parts table would be helpful to  
**Tim Dailey:** Yeah. Yeah. We'll give you a lot more.  
**Davis Gallagher:** them.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Cool. Cool. So,  
**Tim Dailey:** And then we talked about Davis two of the the CAT builder file.  
**Davis Gallagher:** that's kind of  
**Tim Dailey:** I still owe you one so you can look at but um I'm going to get you one. I'm going to have a look at it and then we'll get with Cat to make sure you guys get the the okay to use it.  
**Davis Gallagher:** Perfect. Perfect. Yeah, that'd be great. Um, and then the other thing too, Tim, we we adjusted the right hand side analytics like you mentioned so that uh rather than it kind of being that stock of stuff that you already knew, it's what we talked about and I'll I'll show that.  
   
 

### 00:09:25 {#00:09:25}

   
**Tim Dailey:** Good.  
**Davis Gallagher:** But I think at a high level, Josh, just from a quick flow perspective, I'll I'll do the three different types of quotes that we can generate. So the first is a standard job and we'll just do like 255\. We know it's a heavily used model DY7 uh install software. Uh and you can see when you generate the quote it'll automatically generate a 100% confidence quote based based on the standard job data that we have and it'll show you all the statistics that are related to that particular job. So that's scenario number one. Um scenario number two is when we're using work order data. So we'll use something like 100gs60. Um, we'll use, let's see, we'll use  
**Tim Dailey:** Are these ones you are these machine?  
**Davis Gallagher:** 397\.  
**Tim Dailey:** Are these ones you have pre-populated, Davis, to work for your demo?  
**Davis Gallagher:** That's correct. We can test them out there live.  
**Tim Dailey:** Okay,  
**Davis Gallagher:** If you have a combination,  
**Tim Dailey:** perfect.  
**Davis Gallagher:** like, just throw it out there.  
**Tim Dailey:** Oh,  
   
 

### 00:10:22

   
**Davis Gallagher:** We can do it.  
**Tim Dailey:** that's a weird con. I don't know what the hell that is.  
**Davis Gallagher:** Yeah, this was this was me kind of just playing around and finding,  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** you know,  
**Tim Dailey:** that's fine.  
**Davis Gallagher:** an example of a system that we had 14 work orders for. Um, and very minimal variance between the work orders as well. You can see the parts cost is is very minimally variable.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** The labor cost is very minimally variable. It's really only increasing with the rate of inflation. So, we can use that to generate a medium confidence quote based on the work order data. Um, and then a really uh one where and like I said, this will this is why having the additional parts data will be helpful uh is when we do something that doesn't have a lot of history before. And I'm sure this is going to be another weird combination, but we'll do this one with a load bank test and or actually let's do  
**Tim Dailey:** Yeah.  
   
 

### 00:11:08

   
**Davis Gallagher:** perform uh power systems inspection. Uh we only have one work order for this one. And so we have a low confidence system or a low confidence uh score. And this is where Tim that similarity scoring will come in.  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** And we'll have the five most high similarity jobs pop up. You can see parts overlap and quality match are zero because we don't have the parts data for those particular jobs that are similar. Uh but once we get that that'll allow us to or the system to kick back and say okay I have enough from these similar jobs I'm going to use that to generate the quote rather than this low confidence work order.  
**Tim Dailey:** gotcha.  
**Davis Gallagher:** So it's kind of at a high level how it all works. And then on the right hand  
**Tim Dailey:** Yeah, I'm interested in that last piece.  
**Davis Gallagher:** side,  
**Tim Dailey:** That last piece will be interesting because like we said, there's not a lot of commonality across the the models. So, I'll be interested to see how that logic work that you guys define.  
   
 

### 00:11:50 {#00:11:50}

   
**Tim Dailey:** Um, but it's good to know that this works for non-cat because neither of those are CAT pieces of equipment. So, it just that's strictly off of our history. So, that's good. I don't know if you noticed that, Josh. So, let's um let's throw a combo in here. Um let's do a 980 980\.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** What, Josh? 980 M.  
**Josh gaynor:** Um,  
**Tim Dailey:** There you go. 980M. Let's do a prefix. Is that a drop down for filter prefixes, Davis?  
**Davis Gallagher:** That's correct. Yes,  
**Tim Dailey:** What's  
**Davis Gallagher:** this is actually a good call because I can see that we have MK2 and XDJ.  
**Tim Dailey:** available?  
**Davis Gallagher:** Uh the cases are different, so they're showing up as different prefixes. That's a bug that we'll take back and fix.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** Uh but we got KRS, MK2,  
**Tim Dailey:** Okay.  
**Davis Gallagher:** XDJ.  
**Tim Dailey:** Any of them cars?  
**Herbert Gomes Miranda:** We just cannot see the drop down uh dat because I think you're only sharing the the browser so we  
   
 

### 00:12:44

   
**Davis Gallagher:** Oh, okay.  
**Tim Dailey:** Oh, that's what I was wondering.  
**Herbert Gomes Miranda:** cannot see.  
**Tim Dailey:** That's why if you had the drop  
**Herbert Gomes Miranda:** Yeah, it's because it's on the  
**Davis Gallagher:** Okay. Yeah,  
**Tim Dailey:** down  
**Davis Gallagher:** there is a drop down. I guess it's just not showing up on my end.  
**Herbert Gomes Miranda:** browser.  
**Davis Gallagher:** Sorry about that. Uh, and then job type.  
**Tim Dailey:** okay  
**Davis Gallagher:** Let me actually see if I can share my whole screen to make that a little bit  
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** easier.  
**Tim Dailey:** Yeah.  
**Herbert Gomes Miranda:** Then we will be able to see the drop down.  
**Davis Gallagher:** Okay, how about now? Can you guys see the drop down?  
**Lucas Inacio Luz:** Not yet.  
**Davis Gallagher:** Okay,  
**Tim Dailey:** No.  
**Davis Gallagher:** let me try one more thing. All right, entire screen sharing. How about now?  
**Tim Dailey:** Yep.  
**Herbert Gomes Miranda:** Yes.  
**Tim Dailey:** All right.  
**Herbert Gomes Miranda:** Just  
**Tim Dailey:** So do uh uh 10 remove and install  
**Davis Gallagher:** Yep.  
**Tim Dailey:** uh and then do engine please.  
   
 

### 00:13:31 {#00:13:31}

   
**Davis Gallagher:** Yep.  
**Tim Dailey:** Okay, that's what I was expecting. Okay, so see that Josh it goes to 100% confident because you do have a standard job but my guess is you you would also have some work history there if you scroll  
**Davis Gallagher:** Yeah,  
**Tim Dailey:** down.  
**Davis Gallagher:** for this for this one particularly because we have a standard job, we're not referencing any of the other work order data. Would we want to reference that as well just as a kind of like a user baseline or are we fine?  
**Tim Dailey:** Um, great question. So,  
**Davis Gallagher:** Are we only watching the standard job?  
**Tim Dailey:** you're you're only showing the history if there is no standard job.  
**Davis Gallagher:** That's correct.  
**Tim Dailey:** For a quoting perspective, I think that's fine,  
**Josh gaynor:** Yeah,  
**Tim Dailey:** Josh.  
**Josh gaynor:** the question would be is then when when we get into a standard job review and validation, how would we look to see what the ranges are to say, okay, 13,234 might be the average right now or or might be the number because it's looking at the standard  
   
 

### 00:14:14 {#00:14:14}

   
**Tim Dailey:** Yeah.  
**Josh gaynor:** job. However, work order history says we're between 11,000 and 14,000.  
**Tim Dailey:** Off the Yeah. Okay. So, Dave, that's something as we talked about, it's kind of a two facing tool. Um that it's,  
**Davis Gallagher:** Yep.  
**Tim Dailey:** you know, for outside and inside. So, for the inside, what we're looking to do, too, is so you you have it written that it's going to say you've done x amount of jobs. You've done this a 100 times and no standard job. You should build a standard job. Right? So, you have that piece.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** And then what Josh is asking for, which we didn't talk about, but I think you're you're pretty much right there, is that this standard job says labor is 12,000, which would equal equate to 22 hours, right? Well, we're actually doing it in 30 hours. So, the standard job is wrong on average, right? So,  
**Davis Gallagher:** Yeah,  
**Tim Dailey:** I think you would want on that that analytics piece say this is what your average  
   
 

### 00:15:05

   
**Davis Gallagher:** got it.  
**Tim Dailey:** is,  
**Davis Gallagher:** Got it. Okay. Yeah. I mean, we have that data,  
**Tim Dailey:** right?  
**Davis Gallagher:** so it's a a pretty easy implementation just to add that as well.  
**Tim Dailey:** That's what I'm saying. You you have it, you're just not showing it. So, um, that's great.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** That's So, now let's look at now. So, that makes sense, Josh. Right. If standard job,  
**Josh gaynor:** Mhm.  
**Tim Dailey:** you're good.  
**Davis Gallagher:** And Tim, just a quick thing too, like you can see pretty quickly like 980 KRS,  
**Tim Dailey:** Now,  
**Davis Gallagher:** we have 160 quotes for travel to from uh a machine like that that's probably a standard job candidate right away. So that's kind of why we update these.  
**Tim Dailey:** so your logic is right. Not for travel though, because you could be five minutes from me.  
**Davis Gallagher:** Got it.  
**Tim Dailey:** Josh is an hour from me. So you wouldn't stand a job at travel.  
**Davis Gallagher:** Yeah.  
   
 

### 00:15:47

   
**Davis Gallagher:** Would that would Yeah,  
**Tim Dailey:** It's not It doesn't surprise me that.  
**Davis Gallagher:** that would show up in the miscellaneous costs.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** Got it.  
**Tim Dailey:** But like perform whatever perform is would uh because it's going to be perform.  
**Davis Gallagher:** form inspection. Yep, there we  
**Tim Dailey:** So like this one you look go  
**Davis Gallagher:** go.  
**Tim Dailey:** down. Yeah. So you you have 82 perform inspections. This could be a standard job. Josh, I don't know if this is I don't know if that's a perfect use case for us, but that's the thought process that you have you've done this many without a standard job with all the averages and stuff built into it. So no, that makes that makes sense to me.  
**Davis Gallagher:** Perfect. Any other, you know, combinations that we want to  
**Tim Dailey:** Do you have any now you go  
**Josh gaynor:** How How do you know?  
**Davis Gallagher:** test?  
**Josh gaynor:** I'm just looking.  
**Tim Dailey:** Josh?  
**Josh gaynor:** So, I'm looking at that one. So, you've got an average of $29 and an average of it looks like a half an hour.  
   
 

### 00:16:50 {#00:16:50}

   
**Josh gaynor:** Is that right in the yellow box where Yep. So, how do you know?  
**Davis Gallagher:** Yep.  
**Josh gaynor:** So, the source data that you're pulling that from, how do I know if that's revenue accounts or internal or cost? Because I can tell you my halfhour cost at revenue is about 120 bucks.  
**Davis Gallagher:** Yep. No, Lucas, I don't know if you have any insight onto how this labor hours was calculated.  
**Lucas Inacio Luz:** And I'm not sure I can uh take a look after the meeting to make sure how we calculating this  
**Tim Dailey:** Yeah, Lucas,  
**Lucas Inacio Luz:** one.  
**Tim Dailey:** what we talked about too is we can provide you a sell rate table and Davis that's part of your your read. So, it's going to be your labor. So, you wouldn't even use your averages. Your standard job is fine. That's priced at current. Then when you look at your averages, if you scroll down, I'm more concerned that so you wouldn't even look at the it would be your hours times current rate.  
   
 

### 00:17:53 {#00:17:53}

   
**Tim Dailey:** That's what you would going to want to look at, right? And the same thing for your parts.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** It's going to be your parts at current rate because just because of jobs 15 years ago,  
**Davis Gallagher:** Right.  
**Tim Dailey:** it's still relevant for times and parts, but the pricing is so irrelevant because of rapid inflation. So, you're going to have to you have to look at the IDs to get new pricing for your history, if that makes sense to  
**Davis Gallagher:** Yep. Yeah, that that does make sense.  
**Tim Dailey:** you,  
**Davis Gallagher:** I think that'll be helpful because right now the way that we have done it is we're we're recency waiting the labor cost.  
**Tim Dailey:** right?  
**Davis Gallagher:** So basically like a work order from 12 months ago is 1/4 of the weight of a work order from one month  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** ago. So there's like a time decay to the work order component.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** But if we had the cost rates,  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** it's a lot easier to just input those like the  
   
 

### 00:18:31 {#00:18:31}

   
**Tim Dailey:** We'll do that because your your sale rates aren't created equal because if those calls are internal versus external, it's about half the labor rate if we're charging ourselves or if we're charging the  
**Josh gaynor:** Yeah.  
**Tim Dailey:** customer.  
**Davis Gallagher:** Yeah.  
**Tim Dailey:** So, we'll give you we'll give you the read access to the labor table. If you want, Davis,  
**Davis Gallagher:** Okay.  
**Tim Dailey:** I can send that table over so you guys know what it looks like. Josh, do you want this quoted all at standard rates? Yeah.  
**Josh gaynor:** Yes.  
**Tim Dailey:** Okay. So, that'll make it super easy. I'll just give you literally standard field to be one labor to use. Um, so there's no really matchy matchy stuff for you to do.  
**Davis Gallagher:** Okay. Yeah, that'd be great. And Tim,  
**Tim Dailey:** And that doesn't change so so often.  
**Davis Gallagher:** I know.  
**Tim Dailey:** Only changes one to three times a  
**Davis Gallagher:** Yeah. Yeah. Perfect. Um, and I know that uh Ted spoken to Glenn about the other kind of AX integrations.  
   
 

### 00:19:06 {#00:19:06}

   
**Tim Dailey:** year.  
**Davis Gallagher:** I haven't seen the tables or the column names for any of them. And so I kind of just gave a rough outline and I think you sent it over by email again of the functionality that we were looking to get to. Um so my maybe you and I can meet separately as well to to find make sure we have the right table and column names  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** for  
**Tim Dailey:** let's do that. Davis, let's book some time for you, me,  
**Davis Gallagher:** those.  
**Tim Dailey:** and I'm going to bring someone else in so we can u get to those table names and get the spec filled out. We can probably do it Thursday if we can. Well, when Josh is off, we'll find some time, but I kind of have Thursday blocked off to work on  
**Davis Gallagher:** Okay,  
**Tim Dailey:** this.  
**Davis Gallagher:** perfect. Cool. Um, so I think that that's kind of the the main logic and and and UI. We also have a mobile UI which actually let me show that quickly um just for reference as well.  
   
 

### 00:20:00 {#00:20:00}

   
**Davis Gallagher:** But it's very similar in functionality to what I was talking about previously where I'll actually just clear this all out and generate a new quote. But same thing, a user can come in and enter the particular model number um to get their their machine. Uh let's do 250 5L2. add the job code and the component code and it'll generate that particular quote uh into the mobile front end. So, same sort of functionality just for a mobile UI. I think one thing I wanted to ask about um and sorry, am I sharing my screen? Oh, okay.  
**Tim Dailey:** No.  
**Davis Gallagher:** Well, there we go. Sorry,  
**Josh gaynor:** Go.  
**Davis Gallagher:** I was that was actually messing with the camera button and not sharing my screen. Um but I'll go back to this.  
**Tim Dailey:** No.  
**Davis Gallagher:** Same sort of thing, same sort of uh user flow as the desktop app. Uh but it's for a mobile UI. So somebody in the field could come out uh type in 255 L2 and put in their particular components or their their combinations and it'll generate the quote with the same logic as the desktop app that I was showing.  
   
 

### 00:20:52 {#00:20:52}

   
**Tim Dailey:** Yeah, that's nice.  
**Davis Gallagher:** So uh but one thing to that point that I wanted to to run through with you guys is to make sure like I fully understand the user flow from the mobile app and how that flows into the front end or the desktop use. Um and I apologize if if this was mentioned before. I'm kind of just coming in a little bit late so I want to make sure I have a full understanding of it. But is it is the user flow such that somebody will somebody from the the product services side will go out in the field will you know if potentially if they're traveling beyond site uh or not at their desktop generate a quote through the mobile app that quote should then be pushed through to some other page on the desktop app where it can be  
**Tim Dailey:** push  
**Davis Gallagher:** approved by somebody else and then pushed to AX or do we want to allow like just they can press a button it gets pushed to AX right  
**Tim Dailey:** right to ax because those PSSRs are going to most like like 90% of the time use the mobile app because they're doing think of it like tailgate coding right they're on your site they're going to say okay that's the code I actually want to do push to ax which will create the CSR so we could um get that logged in  
   
 

### 00:21:54 {#00:21:54}

   
**Davis Gallagher:** Got it. Okay, perfect. That's helpful. Thank you. Um and then yeah, I'm sure there's going to be we'll have to kind of think through a little bit more the the mobile app access as well. Um, you know, likely the the way that we would approach it, and I have to confirm this with with Utum, who I think you might have met before, Tim, on some of those integration calls, but uh will probably be like a mobile app within the Rabbit Canvas website that you would, you know, copy and paste a link to that could be accessed to basically through Safari on the mobile app or uh on the on the phone. Um, and just making sure that that can work. But another thing that I think Herbert mentioned to me as well is, you know, needing the app to be functional without some sort of service. Is that an MVP as well?  
**Tim Dailey:** Yes.  
**Davis Gallagher:** Like that they can generate a quote and have things populate even without any sort of service. Okay,  
   
 

### 00:22:40 {#00:22:40}

   
**Tim Dailey:** Yeah.  
**Davis Gallagher:** got it. Thank you. Cool. Uh I think that's that's kind of the the main kind of logic and and walkthrough of the user flow. Josh would would be great to to get your thoughts, any feedback.  
**Josh gaynor:** Yeah, I mean I think if you know just seeing the example is good. I you know I'm a I want to touch play type thing. I'd want to run through a handful. So um that would help me better kind of grasp rationalize. So I don't know if you've got a test link you can send me and I can monkey around for 15 20 minutes.  
**Davis Gallagher:** Yeah.  
**Josh gaynor:** That would be great.  
**Davis Gallagher:** Yeah, absolutely. I can add you to the workspace and I'll send you the link right after this call.  
**Josh gaynor:** Okay, that'd be perfect. And then I can definitely do that.  
**Davis Gallagher:** Perfect.  
**Tim Dailey:** And this is real data, Josh. So if you see something that looks funky, this this is our data.  
   
 

### 00:23:35 {#00:23:35}

   
**Josh gaynor:** Okay,  
**Tim Dailey:** So it's not like when we showed the demo and I told already told Ray he needs to fix his demo video if he's going to try to use it again because  
**Josh gaynor:** perfect.  
**Tim Dailey:** he was uh think he was doing final drives on a wheel loader or something just didn't undercarriage on a 98\. He doesn't doesn't exist.  
**Josh gaynor:** Perfect.  
**Tim Dailey:** But this so if you see anything that's odd, this is our stuff. So we had to we actually poke it.  
**Josh gaynor:** Okay. No, that's good. I'll monkey around and uh hit a few different scenarios and just uh get some feedback for you  
**Tim Dailey:** Um, yep.  
**Davis Gallagher:** Perfect. Yeah,  
**Josh gaynor:** guys.  
**Davis Gallagher:** that's awesome. And then like I said too, the the similarity scoring,  
**Tim Dailey:** Um,  
**Davis Gallagher:** if you see the similarity scores generate now, uh they're not 100% accurate because we don't have the parts data and the parts quantity for each of those.  
**Josh gaynor:** Okay.  
**Davis Gallagher:** So treat that I think as kind of just like a functional thing.  
   
 

### 00:24:18 {#00:24:18}

   
**Davis Gallagher:** Like you'll see that as you know when we get that data in and we have read access to AX, it will be fully functional, but it only works on a subset of the data right now. So just keep that in mind. If you see like parts quantity and parts uh and parts overlap being 0% that's because for  
**Josh gaynor:** Mhm.  
**Davis Gallagher:** those work orders in particular we don't have that data on hand  
**Josh gaynor:** Okay. All right,  
**Davis Gallagher:** yet.  
**Josh gaynor:** that works.  
**Tim Dailey:** And that's a that's just a limitation of what we consider right now. Josh, the the holding the holding point right now and that's part of the spec that we we owe the Milton team is getting the access to and from AX. And what we're doing now is going to be a read. So the tool will work with most recent data and then the the right will come after.  
**Josh gaynor:** Okay.  
**Davis Gallagher:** Yep. Cool.  
**Tim Dailey:** Good.  
**Josh gaynor:** All right.  
**Davis Gallagher:** All right. Um,  
**Josh gaynor:** I like it.  
   
 

### 00:25:07 {#00:25:07}

   
**Tim Dailey:** Do we need Josh for anything  
**Davis Gallagher:** cool. Yeah, I don't think so. But, um, you know,  
**Tim Dailey:** else?  
**Davis Gallagher:** like I said, Josh, I'll send you access to this so you can tool around in a little bit afterwards. and uh appreciate you hopping on and walking through with us.  
**Tim Dailey:** Thanks Josh. Uh Davis,  
**Davis Gallagher:** Absolutely.  
**Lucas Inacio Luz:** text.  
**Tim Dailey:** let's pick a time Thursday that we can get that spec done.  
**Davis Gallagher:** Yep. Let's do that.  
**Tim Dailey:** Uh I need kg.  
**Davis Gallagher:** Um  
**Tim Dailey:** Let me see.  
**Davis Gallagher:** from 12 to 2 Eastern is going to be a little tough. I'm going to be on site uh in at a facility in Chicago as well. So, if you're available, let's say anywhere from like 9 to 11:30 Eastern, that would be great.  
**Tim Dailey:** Dude,  
**Davis Gallagher:** Um,  
**Tim Dailey:** 10 to 11 Eastern.  
**Davis Gallagher:** Yep. Yep, that works.  
**Tim Dailey:** That ditch what you need.  
**Davis Gallagher:** Yep, it's perfect.  
**Tim Dailey:** You and Ray at another trade show.  
   
 

### 00:25:59

   
**Davis Gallagher:** Yeah, right now we're in uh we're in Chicago.  
**Tim Dailey:** All you guys do.  
**Davis Gallagher:** Ray Ray is making me tag along, so you know,  
**Tim Dailey:** That's fine.  
**Davis Gallagher:** you can blame Ray for that one.  
**Tim Dailey:** I do.  
**Ray Hsu:** Yeah, it's not not Vegas. It looks like you survived Vegas, Tim.  
**Tim Dailey:** Yeah,  
**Ray Hsu:** Congrats.  
**Tim Dailey:** I'm I'm going back. I'm going back in two weeks. So, for another trade show.  
**Ray Hsu:** Really?  
**Tim Dailey:** Yeah.  
**Ray Hsu:** Um, Tim, I did want to ask you, I don't know, were there any more topics, Davis?  
**Davis Gallagher:** Yeah,  
**Ray Hsu:** Okay,  
**Davis Gallagher:** the only other topic was was around uh the AX piece.  
**Ray Hsu:** go for it.  
**Davis Gallagher:** I know in talking to Glenn once we define that spec, we should be able to get read access pretty quickly. I did want to talk about right access and how we handle that. So,  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** um he he mentioned to me on a call on Monday that it might be another two months before right access is properly scoped out.  
   
 

### 00:26:51 {#00:26:51}

   
**Davis Gallagher:** And so to make sure that especially as we move forward to kind of like testing with Josh and testing with the people in the  
**Tim Dailey:** Heat.  
**Davis Gallagher:** field that we're not losing these outputs of generated quotes, one thing that I was thinking about for a stop gap solution could be that each generated quote in the system is populated into a CSV file which then you can export via SFTP and upload back to AX. But that means, you know, I'm assuming that you can upload a CSV to AX if we have the matching column and table names. So I don't know if that's the case and I wanted to see if that made sense or if that was functionality that could be included so that while we're waiting right access you can still put things back into AX on interim  
**Tim Dailey:** I think while we're waiting waiting right access,  
**Davis Gallagher:** basis.  
**Tim Dailey:** we just wouldn't use the push functionality. It's a very fragile system.  
**Davis Gallagher:** Okay.  
**Tim Dailey:** Um, the way we have it right now, I mean, it's it's literally on its last legs.  
   
 

### 00:27:41 {#00:27:41}

   
**Tim Dailey:** Um, so we don't want to we don't want to push it too too  
**Davis Gallagher:** Okay.  
**Tim Dailey:** much.  
**Davis Gallagher:** Got it. All right. That'll make it easier to scope out. So, um, as long as it's not a, um, as long as there's still, um, you know, I just wanted to make sure that that that wasn't like a a super high requirement while we're awaiting right  
**Tim Dailey:** No. And and I know it's on us,  
**Ray Hsu:** It's  
**Davis Gallagher:** access.  
**Tim Dailey:** not you guys. So that's that's I understand that  
**Ray Hsu:** important.  
**Davis Gallagher:** Perfect.  
**Tim Dailey:** piece.  
**Davis Gallagher:** Awesome. Well, I think uh the only other thing I have other than that is I sent over I know I sent over a long email on Friday, Tim, so I apologize for that,  
**Tim Dailey:** That's good.  
**Davis Gallagher:** but I sent over a document which has kind of like the success criteria, UAT timeline, potential go live. U would be great just to get your initial thoughts on that and then if you have a list of people who we should expand UAT testing to other than Josh, would love to give them access to mess around with the app as well.  
   
 

### 00:28:33 {#00:28:33}

   
**Tim Dailey:** Yeah. Um once we have more data in there, then I want to really open it up and I have a kind of a list of people on my probably about four or five um PSSRs that I would use, but I want to make sure we have the read access before I give it to them because Josh can can see the uh what's it? See the forest of the trees. I don't know how that saying goes, but he can understand that this is play data. Once we get to the next set, they're going to want to work in  
**Davis Gallagher:** Got it. Got it. Okay.  
**Tim Dailey:** model.  
**Davis Gallagher:** Yep. That's perfect. Cool. And the only other thing, like I said, is if you can if you can give that document a read and give me a thought on your alignment on success criteria and the timeline.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Uh that's that's it.  
**Tim Dailey:** I'll have it for you. Let's book that meeting for Thursday and I'll have that all done for you for that meeting as well.  
   
 

### 00:29:17 {#00:29:17}

   
**Davis Gallagher:** Perfect. Cool. Well, yeah, Ray, I'll toss it over to  
**Ray Hsu:** Yeah, I think I had uh two questions. One,  
**Davis Gallagher:** you.  
**Ray Hsu:** Tim, on the um the AX integration, I think we have a couple of other use cases we're working with Ray and Amy that are are blocked as  
**Tim Dailey:** Yes.  
**Ray Hsu:** well. Uh I just want to make sure I mean,  
**Tim Dailey:** Yep.  
**Ray Hsu:** have you I just want to make sure you've kind of told Doug about it. I just want to make sure like like he know he he understands that you know it's been escalated and and it  
**Tim Dailey:** Yep.  
**Ray Hsu:** is what it is or is there some Okay,  
**Tim Dailey:** Yep. Uh Doug knows we were working on it.  
**Ray Hsu:** cool.  
**Tim Dailey:** I actually reached out to Scott Simon our CEO today to get a better time fra frame because I think the timeline we were getting was a hopeful time frame and not a realistic one. So I'm working to get a realistic time frame here because we just need real  
   
 

### 00:30:07 {#00:30:07}

   
**Ray Hsu:** Okay. Okay.  
**Tim Dailey:** times.  
**Ray Hsu:** Great. Yeah. Um, so yeah, I just want to make sure that was at least visible. Um,  
**Tim Dailey:** Yep.  
**Ray Hsu:** the other one was the uh the Caterpillar data for looking at  
**Davis Gallagher:** See  
**Tim Dailey:** Yeah.  
**Ray Hsu:** it looks like the last email um I guess they're testing and as soon as they get something  
**Davis Gallagher:** right?  
**Ray Hsu:** so uh we can try it out.  
**Tim Dailey:** Yep.  
**Ray Hsu:** So that that would be huge too if we can get access to that.  
**Tim Dailey:** Yeah. So, last I got from Adam. Adam's that cat for the GCSS team beginning tomorrow. They work I should have an update next week. So, that was last Thursday. So, they know. So, this has been escalated through CAT. This Adam guy knows what we're looking for and his boss knows what we're looking for. So, uh, I have it on my come up file for tomorrow that if I don't hear anything to to, uh, poke them a little bit because that's a big one because you're waiting on us and you're waiting on  
   
 

### 00:30:57 {#00:30:57}

   
**Ray Hsu:** Okay, great. And then uh  
**Tim Dailey:** CAT, not for the you're waiting on us for a waiting for them for  
**Ray Hsu:** Yeah. Yeah.  
**Tim Dailey:** GCSS,  
**Ray Hsu:** The GCS says we're not we don't have an official use case there, but I know the merchandising use case that is on the docket is we would love to  
**Tim Dailey:** right?  
**Ray Hsu:** kind of dig into that and see what's there and assess the feasibility.  
**Tim Dailey:** Yep.  
**Ray Hsu:** Okay. Uh the last thing is, you know, uh I'll I could reach out to Doug, but I think he was we have a uh we have an exec review with Doug in April. Um when I wanted to see like when the next CAT dealer meeting was. Do you know like uh because it'd be great to show some at least enough success where he's comfortable sharing with the the other dealers.  
**Tim Dailey:** Yeah, we have a lot of cat cat dealer meetings. So, it depends on which ones you're looking for. Um,  
**Ray Hsu:** Okay.  
**Tim Dailey:** we they do them a lot depending on what it is, but I know honestly we have a big one in September and that that's farther out.  
   
 

### 00:32:00 {#00:32:00}

   
**Tim Dailey:** I know there's other ones probably sooner,  
**Ray Hsu:** Okay.  
**Tim Dailey:** but that's the one that you are going to want to have everything working and ready for. Um that that one is when we talk that's that is a dealerrun dealer solution  
**Ray Hsu:** Okay.  
**Tim Dailey:** meeting that all the dealers bring their best practices and solutions together to show each other.  
**Ray Hsu:** Ah,  
**Tim Dailey:** Um and what that's the one I think that Doug talked to you about.  
**Ray Hsu:** okay.  
**Tim Dailey:** Um that's the one that we would be interested in you guys, you know, having a working model because it is kind of a show and tell for the dealers and we like to show our best and we're looking at this to be one of our one of our shows.  
**Ray Hsu:** Okay, fantastic. Okay, we'll look for I thought for some reason I thought it was June. Okay,  
**Tim Dailey:** There might be something else in June,  
**Ray Hsu:** sounds good.  
**Tim Dailey:** but the the big one in September, we host that this year. So, we we always want the host kind of always wants to put on a little bit of a a bigger show.  
   
 

### 00:32:43

   
**Ray Hsu:** Okay.  
**Tim Dailey:** Um, so we want this to be, you know, this the inventory, GCSS, and this right here would be our three kind of crown jewels to show.  
**Ray Hsu:** Excellent.  
**Tim Dailey:** There might be one in June though that I don't know about. Like I said, there's a cat meeting every two minutes.  
**Ray Hsu:** There's cat meetings every Okay.  
**Tim Dailey:** So,  
**Ray Hsu:** All right. Perfect.  
**Tim Dailey:** and uh I have been working on the on-site.  
**Ray Hsu:** That's up.  
**Tim Dailey:** I did not forget about it. It's just we had a crazy last week with ERP. I always said it every week, but I have time blocked already to review all that documentation that you guys did. So, I didn't forget about it. I have time blocked to look at it and to say, okay, these are some solutions we want to look at. These are we might want to push at. So, um I don't want to think that your efforts were just for not. So, I am going to review that and we can look at what we have there. So, I do have time blocked off.  
**Ray Hsu:** Okay.  
**Davis Gallagher:** Yeah.  
**Tim Dailey:** Yeah.  
**Ray Hsu:** Okay. Appreciate it.  
**Davis Gallagher:** Yeah. Thank you. And no worries. It's uh I know it's super busy, so totally understand. Cool. I think uh I think that's that's it for my end. Anything else, Tenn you wanted to go over?  
**Tim Dailey:** Go. We'll get the feedback from Josh.  
**Davis Gallagher:** Okay.  
**Tim Dailey:** Josh isn't shy for feedback, so we'll see what he has to say.  
**Davis Gallagher:** Awesome. Yeah, I'm looking forward to that.  
**Tim Dailey:** Awesome. Great. Thanks, guys.  
   
 

### Transcription ended after 00:34:15

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*