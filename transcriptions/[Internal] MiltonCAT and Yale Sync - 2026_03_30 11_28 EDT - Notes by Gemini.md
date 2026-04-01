# 📝 Notes

Mar 30, 2026

## \[Internal\] MiltonCAT and Yale Sync

Invited [Jigisha Rojasara](mailto:jigisha@rapidcanvas.ai) [Lucas Inacio Luz](mailto:lucas.inacio@rapidcanvas.ai) [Fuge Zou](mailto:fuge@rapidcanvas.ai) [Ray Hsu](mailto:ray@rapidcanvas.ai) [Davis Gallagher](mailto:davis@rapidcanvas.ai) [Herbert Gomes Miranda](mailto:herbert@rapidcanvas.ai) ~~[Nitin Gupta](mailto:nitin@rapidcanvas.ai)~~

Attachments [\[Internal\] MiltonCAT and Yale Sync](https://www.google.com/calendar/event?eid=azA4NzQ4ZXM2Nmt2cW5uMTBkcXZiYXR1aXVfMjAyNjAzMzBUMTUzMDAwWiBkYXZpc0ByYXBpZGNhbnZhcy5haQ) 

Meeting records [Transcript](?tab=t.2qw7aga0k3w7) 

### Summary

Project progress review emphasized clear communication for workload management, with alignment on Milton demand forecasting logic and the use of standard OCR for Claims to PO data parsing.

**Communication and Workload Management**  
Clear team communication, using simple acknowledgments like a thumbs up or down, was established as necessary to manage competing priorities and address quick turnaround times. This system ensures bandwidth issues are quickly flagged so additional support can be looped in for team members if needed.

**Demand Forecasting and Data Parsing**  
For Milton demand forecasting, the team aligned on SKU grouping logic and implementing manual adjustments to demand on the front end if the Dodge data warrants a change. The Claims to PO approach shifted from using an LLM to standard Optical Character Recognition for data parsing, reducing processing time and confirming the feasibility of automated PDF editing.

**Project Status and Data Issues**  
The Yale project is tracking well, with the critical next step being connecting the back end to the front end by the end of the week for primary stakeholder validation. A major data issue was flagged where CSV files are being sent as .txt files with internal commas, requiring an inquiry to Jeff about receiving true CSV files for the model file.

### Details

* **Meeting Introduction and Weekend Check-in**: The meeting started with greetings, and participants shared updates on their weekends, including Lucas Inacio Luz's relaxing time with family. Herbert Gomes Miranda mentioned a stressful weekend due to discovering their dog requires surgery for a patella dislocation, which involves several expensive preparatory exams before the surgical technique can be determined ([00:00:00](#00:00:00)). Davis Gallagher expressed sympathy for the situation and wished them well ([00:01:36](#00:01:36)).

* **Acknowledgement of Recent Project Progress and Team Support**: Davis Gallagher thanked Jigisha Rojasara and Herbert Gomes Miranda for their work on Friday and over the weekend, specifically for getting everything in place with Yale, preparing the pipeline, and adjusting the wireframe. Davis Gallagher noted that the UI is functionally exactly what they would want from a planner or buyer's perspective, and acknowledged Herbert Gomes Miranda for implementing business logic. Davis Gallagher also reported that the primary stakeholder, Joe, is adding a new user named Daniel who will likely be the primary liaison moving forward ([00:02:48](#00:02:48)).

* **Communication and Workload Management Guidelines**: Davis Gallagher emphasized the need for proper workload management due to competing priorities among the team members. They requested that moving forward, if a message contains something unclear or if a target date has too quick of a turnaround, the team should communicate this with a simple acknowledgment, like a "thumbs up" or "thumbs down," to confirm if they are on track ([00:03:47](#00:03:47)). This clear communication will allow Davis Gallagher to loop in additional support if bandwidth becomes an issue ([00:04:58](#00:04:58)).

* **Milton Demand Forecasting: SKU Grouping and Phase Logic**: For Milton demand forecasting, the team has two or three major tasks, with a goal of implementing baseline functionality before Wednesday afternoon's call. Herbert Gomes Miranda was tasked with implementing minor tweaks to the SKU hierarchy file, which will serve as the SKU grouping for legacy and forward-looking SKUs ([00:05:46](#00:05:46)). The phase-in phase-out logic dictates that forecasting for a retired SKU will continue until its quantity on hand reaches zero, and the historical data from the legacy SKU will be leveraged as a baseline for the new SKUs until three to five months of new data are available to implement machine learning forecasts ([00:06:47](#00:06:47)).

* **Milton Demand Forecasting: Dodge Data Planner Adjustments**: The team aligned on allowing the planner to manually make adjustments to demand on the front end if they believe the Dodge data warrants changing or increasing the demand ([00:07:53](#00:07:53)). Davis Gallagher's initial idea for the user experience is to have key cards in the "monthly demand breakdown" section of the "view details" page, allowing a user to press a plus or minus button to edit the forecast for a particular month and confirm the change ([00:09:03](#00:09:03)). Herbert Gomes Miranda noted that the back end for this functionality had been previously completed, though it is currently not showing up in the data application, so investigating why this feature is missing is a priority ([00:10:34](#00:10:34)).

* **Services Quote Updates**: Davis Gallagher reported having some questions regarding feedback received from Tim on the services quote side, noting that the one-line comments require clarification before moving forward. The main focus for the next couple of weeks will be updating the UI to dynamically adjust based on whether the user is accessing the app from mobile or desktop, and adding the sync feature and functionality ([00:12:43](#00:12:43)).

* **Claims to PO: Change in Approach for Data Parsing**: Davis Gallagher confirmed an agreement with Amy that the purchase orders (POs) will consistently arrive in the same format and from the same location, validating Herbert Gomes Miranda's suggestion to use standard Optical Character Recognition (OCR) instead of an Large Language Model (LLM) for data parsing ([00:14:10](#00:14:10)). This change in approach is expected to improve functionality by significantly reducing the processing time for large POs ([00:15:05](#00:15:05)).

* **Claims to PO: New Functional Requirements and Features**: The core functionality requested for the front end is a task log that shows all processed claims, their posting status to AX, and all captured fields. Amy requested two new features to explore: the ability to automatically write the PO number back onto the PDF claim invoice, which they currently do manually, and pushing an email alert with the processed document and PO number to the Accounts Receivable department ([00:15:05](#00:15:05)). Herbert Gomes Miranda confirmed that editing the PDF is possible because the file is not an image ([00:16:16](#00:16:16)).

* **Claims to PO: Automated Email Notification Capability**: Herbert Gomes Miranda expressed uncertainty about setting up the email function but Fuge Zou confirmed that sending an email alert is very easy using their internal email server ([00:17:21](#00:17:21)). Fuge Zou offered to share the necessary code with Herbert Gomes Miranda to implement this notification system ([00:18:21](#00:18:21)). Amy also confirmed that data ingestion for claims invoices will be handled via a batch drop into an SFTP every Sunday, similar to the process for demand forecasting, with no direct integration beyond that method ([00:19:21](#00:19:21)).

* **Yale Project Status and Immediate Next Steps**: The team agreed that the Yale project is in a good place, with the main outstanding item being connecting the back end to the front end by the end of the week. This connection is critical because the primary feedback required from Yale is validation that they align with the structure of the wireframe and UI ([00:20:21](#00:20:21)). A few adjustments to the business logic, as outlined by Herbert Gomes Miranda, are also due by the end of the week ([00:21:28](#00:21:28)).

* **Yale Project: Work Order Data and Knowledge Assistant**: Davis Gallagher noted two open questions for Joe: whether they should use the assumption that 30% of open work orders close as an actual sale, an assumption Davis Gallagher is personally against due to potential forecast volatility, and further definition of the Ask AI/Knowledge Assistant component ([00:21:28](#00:21:28)). The knowledge assistant is intended to help users ask defined questions and get faster answers than traditional reports ([00:22:21](#00:22:21)). The team is tracking to finish the prototype by April 22nd ([00:23:16](#00:23:16)).

* **Yale Project: Data File Format Issue**: Lucas Inacio Luz inquired about the data source, and Davis Gallagher clarified that data is currently being received weekly via five CSV files pushed to their S3 bucket ([00:23:16](#00:23:16)). Herbert Gomes Miranda flagged that the files are actually being sent as \`.txt\` files, and while some use a bar separator, the \`model file\` uses commas but contains commas inside the values, leading to malformation issues ([00:24:15](#00:24:15)). Herbert Gomes Miranda requested that Davis Gallagher ask the primary IT stakeholder, Jeff, if they can send true CSV files for greater reliability, especially for the critical model file ([00:25:20](#00:25:20)) ([00:27:54](#00:27:54)).

### Suggested next steps

- [ ] Herbert Gomes Miranda will investigate why the monthly demand breakdown section, which allows for manual demand adjustments, is not showing up in the data app for specific SKUs.

- [ ] Davis Gallagher will draft a wireframe for the task log status tracker front end for the claims to PO project.

- [ ] Fuge Zou will share the email server code with Herbert Gomes Miranda to implement the email notification system.

- [ ] Herbert Gomes Miranda, Lucas Inacio Luz, and Fuge Zou will explore the possibility of automatically writing the PO number back onto the claims PDF and pushing an email alert with the document to the accounts payable inbox after processing.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*Please provide feedback about using Gemini to take notes in a [short survey.](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=KpNGkhMS2apW0hXhIqoBDxITOAIIigIgABgBCA&detailid=standard)*

# 📖 Transcript

Mar 30, 2026

## \[Internal\] MiltonCAT and Yale Sync \- Transcript

### 00:00:00 {#00:00:00}

   
**Davis Gallagher:** Hey everybody. Morning. Good evening.  
**Lucas Inacio Luz:** A  
**Herbert Gomes Miranda:** their  
**Lucas Inacio Luz:** face.  
**Davis Gallagher:** How's it going?  
**Lucas Inacio Luz:** I'm fine. And  
**Herbert Gomes Miranda:** Great. And  
**Davis Gallagher:** Doing well.  
**Lucas Inacio Luz:** you  
**Herbert Gomes Miranda:** you  
**Davis Gallagher:** Doing well. Appreciate you asking. How was your guys weekend?  
**Lucas Inacio Luz:** uh it was good for me. I just stayed at home with my family and just relaxing. No working for this weekend.  
**Davis Gallagher:** Nice. Nice. Good. I'm glad to hear that. Glad it was a good good rest and recovery weekend. What about you, Herbert?  
**Herbert Gomes Miranda:** It was sad, financially sad, too, because I discovered the dog needs to uh do a surgery. He he he has the the patella  
**Davis Gallagher:** Oh.  
**Herbert Gomes Miranda:** dislocation.  
**Davis Gallagher:** Oh, no. I'm sorry to hear that.  
**Herbert Gomes Miranda:** Yeah, he need to do a surgery.  
**Davis Gallagher:** Oh, that's uh that's scary.  
   
 

### 00:01:36 {#00:01:36}

   
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** When is that um is that going to happen soon or is that like a a few months thing  
**Herbert Gomes Miranda:** Uh uh I don't know.  
**Davis Gallagher:** or they need to do it pretty  
**Herbert Gomes Miranda:** He needs to do I think like six five or six exams  
**Davis Gallagher:** quick?  
**Herbert Gomes Miranda:** first expensive ones. And and so the the orthopedists I I think that's how it's said. um can decide the way he's going to do the the the surgery because there's a lot of ways to do that. There are several uh techniques. So he doesn't know yet which technique the dogs is going to need.  
**Davis Gallagher:** Oh man. Yeah. Um. Oh, dang. I'm sorry. That's a bummer. Um, sounds uh it does sound a little stressful. So, I hope everything's all right.  
**Herbert Gomes Miranda:** It's okay. Thanks.  
**Davis Gallagher:** Sure. For sure. I'm sure that after that though he'll be uh springing and ready to go again.  
   
 

### 00:02:48 {#00:02:48}

   
**Davis Gallagher:** Um so I hope it all goes well.  
**Herbert Gomes Miranda:** Thanks.  
**Davis Gallagher:** Yeah, of course. Um cool. Well, uh first want to thank uh Jigashu and Herbert for um the push on Friday and then I know there was a little bit more uh over the weekend as well. Thank you guys for for getting everything in place with Yale. Um getting the pipeline ready in the back end, Jigasha, making those adjustments to the wireframe. I think um just from my perspective, like from a functional perspective, the UI is exactly what from my background I would want as somebody who is a planner or a buyer. So I really like the changes we've made and Herbert, thank you for getting everything in place and starting to implement some of the business logic as well. Um I think we're it that puts us in a really good spot. Um, and we've got uh I've been messaging back and forth with our primary stakeholder, Joe. Uh, he's really busy. He's going to add a new user to our project.  
   
 

### 00:03:47 {#00:03:47}

   
**Davis Gallagher:** His name is Daniel. He's going to be probably our primary liaison moving forward. Um, but they're pretty excited and um I think we're we're in great a great shape. So, I know that there's a lot bouncing around and and like I said, it was uh busy last week, but I really do appreciate you guys leaning in and and helping get this in in a pretty good spot where I think they're they're pretty happy. So, thank you. Um, and on that note, just um, for like future reference in terms of um, ways of working, I I know that there's a lot bouncing around, especially for for you, Herbert, Jigasha, and I know you too, Lucas, you guys have a lot of competing priorities. Um, so you know, I want to make sure to manage those properly so that you guys are not getting overloaded and that everything is clear in terms of what needs to be done and what our target dates are and that we can work together if we need to push things back. Um, so moving forward, if I like, you know, send one of those messages where I have, you know, something that's not fundamentally clear or that the target date is just too quick of a turnaround, um, please let me know.  
   
 

### 00:04:58 {#00:04:58}

   
**Davis Gallagher:** Just give me like a thumbs up, thumbs down, like, yep, acknowledged. I see this like we're on track or we're not on track. Um, just having that that communication between us I think will be helpful. And like I said, it'll help me also be able to loop back and get some folks on board who can help us out from a bandwidth perspective if you guys are feeling um that you don't have the time or um, you know, the capacity to be able to do stuff. So, um, you know, apologies for for throwing a bunch of stuff out. Um, but like I said, just just keep me in the loop when anything's unclear or um, you know, if we if we feel like we can or cannot reach the, you know, the target um, in terms of what we've outlined. So, um, just want to throw that out there. Like I said, want to support you guys, but but thank you again for for leaning in here.  
**Lucas Inacio Luz:** Well, thank you also, Davis, for helping us all that.  
   
 

### 00:05:46 {#00:05:46}

   
**Davis Gallagher:** Yeah, absolutely. Thank Thank you, Lucas, for for leaning in again. It's been uh, super helpful. Cool. Okay. Um I think we can get to tactical stuff now in terms of the week ahead. Um on the Milton demand side, uh I'll start I'll start there. We'll start with Milton, run through those and then we'll go to Yale to close it out. Um on the demand forecasting side, there's two I guess three major tasks. um two I guess one of which or two of which hoping to at least have um some baseline functionality implemented prior to our call Wednesday afternoon. So that's over the next like two days hopefully. The first is uh adjusting the skew grouping. Herbert I sent I forwarded over an email from Andy and I'll I'll put in our Slack thread as well, but he finally took a look at our email or our our skew hierarchy uh file and he pretty much gave it a thumbs up. he had some minor tweaks that I don't think he made directly into the file, but just were an email.  
   
 

### 00:06:47 {#00:06:47}

   
**Davis Gallagher:** So, if we could implement that as our like skew grouping, our our family SKUs to have the uh the legacy and the the looking forward SKUs, that would be great. I think also on that end, kind of the next piece to it is the phase in phase out logic. Um I have some some first thoughts on that and essentially the idea and we'll validate this with Ry um but I think he's already given us the thumbs up initially. The idea is that when we know a skew is going to be transitioned from one mile to another. The what we're going to do from a forecasting perspective is continue to forecast forward demand until the quantity on hand for that retired skew reaches zero. So they essentially operate with the the mindset that when we are going to retire a skew, we don't want to retire it immediately because we obviously need to sell all of our inventory. So we want to continue to project demand until our inventory is run out for that skew. So anytime we see a legacy or a transition skew, we'll continue forecasting it until we get a zero quantity on hand uh for that particular product.  
   
 

### 00:07:53 {#00:07:53}

   
**Davis Gallagher:** And then for the new SKs that are going to take over for that legacy skew, what we'll do is leverage the historical data from the legacy skew as a baseline for the demand model. And then once we get let's say 3 to five months worth of data, we can actually implement the the machine learning forecasts um with hopefully some more accuracy. So that I think is the initial logic that we want to use. Nothing too crazy. I don't think they have any crazy phase in phase out curves beyond what I just outlined. So that's about it. Does that make sense?  
**Herbert Gomes Miranda:** Sure.  
**Davis Gallagher:** Okay, perfect. Cool. And then the other piece is the demand uh or the Dodge data. Jigasha, thank you for making the updates to the front end. They were thumbs up with how we went about it. Uh showing at the subcategory level and basically leaving it up to the planner to determine what to do. Um to that end, what we've aligned on is allowing the planner, if they do believe that there is enough information to warrant changing or increasing demand, to manually make adjustments on the front end.  
   
 

### 00:09:03 {#00:09:03}

   
**Davis Gallagher:** And where that would live is essentially um and and I would like feedback here because this is just my initial idea. Uh, so if you disagree or you think it's kind of a a stupid idea from a UX perspective or it's tough from the back end to do, please let me know. Um, but I'll pull it up now and show what I'm I'm envisioning, I guess, as a starting point. Just waiting for it to load. There we go. So my initial thought was we'll have these indicators at the subcategory level and then as we talked about to Rey to really understand the actual related Dodge construction projects a user should go into the view details page and then check out this related Dodge construction projects column which is that table or amalgamation of all the different Dodge projects that the LLM has assessed are linked or could be linked to this particular skew. What we want to allow a user to do is in this monthly demand breakdown section be able to press a a button or change the input that changes the forecast for a particular month.  
   
 

### 00:10:34 {#00:10:34}

   
**Davis Gallagher:** So in this example, CAT 255, we have a March forecast of 11, an April forecast of 11, a May forecast of 10, etc., etc., all the way out until August. In this view details page in the monthly demand breakdown, we want to have uh you know a key card for m March, a key card for April, a key card for May, a key card for June, so on and so forth that has the projected demand where a user could essentially press a plus button, a minus button to make that edit to the demand if they see something that warrants a change and then press a confirm button that would then pull through that demand adjustment to the front end. That is my initial thinking. um want to leave it up to the group to see if that makes sense from a user flow perspective and what that would require from a backend adjustment as well.  
**Herbert Gomes Miranda:** Uh it it was done already I think. I don't know why it's not showing up in the data app but uh we had this feature.  
   
 

### 00:11:35

   
**Herbert Gomes Miranda:** It used to show uh the monthly demand breakdown. It should uh it usually showed like uh five cards with those options you just said six cards actually. D6 in future. I don't know why it's not showing you.  
**Jigisha Rojasara:** So as I I think some data might be telling but I as as far as I know it was just a static side sort of thing from the front end. We haven't duplicated the second part of  
**Herbert Gomes Miranda:** No, I sent you the the both uh the two APIs for deleting and getting the data. I think it was like a month ago and it was working. I don't know. It's not why it's not showing up. The the back end for this has been done already. A long time ago actually.  
**Davis Gallagher:** Okay. Yeah. If that's if that's already a thing,  
**Jigisha Rojasara:** Yeah, I think  
**Davis Gallagher:** can we can we investigate why that's not showing up for specific SKUs or or where what happened there?  
   
 

### 00:12:43 {#00:12:43}

   
**Herbert Gomes Miranda:** Yeah, maybe maybe some data broke and that that's the reason it's not showing.  
**Davis Gallagher:** Okay. Yeah, let's let's look into that, I guess, as priority number one then. Um because I think showing that to Ry would be uh I think he'd appreciate that feature.  
**Herbert Gomes Miranda:** Okay.  
**Davis Gallagher:** Cool. Um, and then other than that, we're good on the demand forecasting side. Um, and food guides, I see you joined. Thanks for hopping on. We're just walking through the all the different projects right now. Um, on the services quote side, um, got some feedback from Tim. Uh, I Herbert, Lucas, you guys are on that thread. Um, I do have some questions on his feedback. Um, it's not abundantly clear. Um some of them are they were just oneliners essentially that we don't have enough to really move on. So uh requested some clarification hopefully we'll walk through those on Wednesday. The main thing that we'll be working on um over the course of the next couple weeks is the updates to the UI for uh dynamic basically making the the UI dynamic to understand where a user is uh accessing the data app from whether it's mobile or desktop so they don't need to make that selection directly in the data app and then also adding that sync feature and functionality as well.  
   
 

### 00:14:10 {#00:14:10}

   
**Davis Gallagher:** So we we talked about that this morning. I know we we already covered a Jigasha with Pachchi and Utum, so we're good there. But otherwise, services quoting is in a good is in a good place.  
**Lucas Inacio Luz:** I was good in  
**Davis Gallagher:** Cool. Uh on the claims to PO side, Herbert, I had a great conversation with Amy last week um that validated exactly what you told me uh that the POS are always going to be the same format. they're always going to come from the same place and that there's no reason for us to essentially use an LM to parse the data. Uh so I am 100% with you. Let's move forward with uh using just some standard OCR to parse that data. Um and we've got that like I said thumbs up from for me to do that. I didn't explain that in detail, but she confirmed the the scope of of of what those are. So we can change that in our approach and I think it'll be a lot better from a functionality perspective.  
   
 

### 00:15:05 {#00:15:05}

   
**Davis Gallagher:** We won't have to wait 25 minutes for a 20page PO to uh to process. So that was good. Um and then let me see if I have additional details on I have another find these notes. Um she gave some additional context on the UI UX as well. Um, so essentially the only thing that she's looking for from a functionality perspective is like you said Herbert, a task log which shows all the different claims that we've processed, what their status is in terms of posting to AX and all the different fields that we've captured. So um it's basically just a a log status tracker front end that they could be able to access. Um so I'll draft up a wireframe for that. Um, and then the last piece that she asked, um, and this is a question that I wanted to ask all three of you guys, Lucas, Fuga, and Herbert. Um, which it may be a little bit on top of the scope that we've already defined. Um, but two features that she mentioned would be incredibly valuable for her would be when we take that claims invoice and we push it into AX and we get the PO number that's associated with that claim in AX.  
   
 

### 00:16:16 {#00:16:16}

   
**Davis Gallagher:** Is there a way that we could actually write the PO number back onto the PDF? Because right now they manually edit the PDF and write the PO number on it. So, can we automate that process? And then can we also push out an email alert to certain users to tell them this is particularly their accounts receivable department that hey accounts receivable we've processed this claim it's now pushed to AX here's the PO number here's the document that was her asked to us is can we explore those feature sets as  
**Herbert Gomes Miranda:** I I I'm pretty sure that's that's possible because the the PDF they use is not an  
**Davis Gallagher:** well  
**Herbert Gomes Miranda:** image. So it's not it's a it's a literary PDF like with with OCR native.  
**Davis Gallagher:** After  
**Herbert Gomes Miranda:** So that that's doable for sure. But where will we have to push this PDF then after editing it?  
**Davis Gallagher:** editing it, she was wondering if we could uh use either our inbox or I'm not sure exactly how what the method would look like, but she wanted us to push it to the accounts payable inbox.  
   
 

### 00:17:21 {#00:17:21}

   
**Davis Gallagher:** So essentially after we write back the PO number back onto the PDF, what they do right now is somebody manually writes the PO number back onto it, then downloads it and then sends it to accounts payable and says, "Hey, accounts payable, we've got this. Go handle it. Go get the money for it." Um, they were wondering if we can somehow automatically push that email to their accounts payable team whenever the documents are processed.  
**Herbert Gomes Miranda:** Yeah, sure. I just never worked with uh sending email. I think Lucas or Fugia may have done this before in other projects. Uh but I don't know how I would do that. But uh editing PDF for sure it's it's possible.  
**Lucas Inacio Luz:** Uh yeah, I didn't uh do that before,  
**Davis Gallagher:** Sweet.  
**Lucas Inacio Luz:** but uh I think it's pretty much easy to do. So, we can explore, try to find a way.  
**Davis Gallagher:** Okay. Do you have any thoughts there?  
**Fuge Zou:** What's a  
**Davis Gallagher:** Um,  
**Fuge Zou:** question?  
   
 

### 00:18:21 {#00:18:21}

   
**Davis Gallagher:** one of the asks from Amy in terms of the solution is to once we submit a claim into AX, um, and generate a PDF from that, can we send that PDF to a shared Milton Cat email inbox every time a document is  
**Fuge Zou:** Uh it's very easy. Uh it's very easy.  
**Davis Gallagher:** processed?  
**Fuge Zou:** Herbert, I'm going to share you the code so you can follow the code. Okay. Um so we have the uh email server.  
**Davis Gallagher:** Sweet.  
**Fuge Zou:** So um I can um we have the email server so I can send you the  
**Herbert Gomes Miranda:** Okay.  
**Fuge Zou:** code. Yeah. So we have the email server. You can follow the server. Um so we we send email from the server,  
**Herbert Gomes Miranda:** Oh, that's great. Thanks,  
**Fuge Zou:** right, to their emails. It's just like a notification system. uh once you uh once you finish some uh you can just do that as a recipe.  
**Davis Gallagher:** Cool.  
**Fuge Zou:** So um yes it's very um but but you know there are some third party services but internally we have that uh in our in our company so I can send that code  
   
 

### 00:19:21 {#00:19:21}

   
**Herbert Gomes Miranda:** Oh, that's great.  
**Davis Gallagher:** Cool.  
**Herbert Gomes Miranda:** I didn't know about that.  
**Davis Gallagher:** Yeah, it's good to know. Um, and Amy was very excited when uh she's talking about this, so I think uh we're primed for a good opportunity there. Um and and obviously this one's going to be a lower priority because we're still awaiting AX integration. Um from a data ingestion perspective, Herbert, she confirmed that the way we're going to go about it is they're going to batch drop all of the  
**Fuge Zou:** Mhm.  
**Davis Gallagher:** claims invoices into an SFTP just like they're doing for demand forecasting right now. So it'll be every Sunday they'll have a scheduled job that will just push all the claims invoices into our SFTP and we'll ingest them and write them back into AX. But there's going to be no direct integration other than the way we're doing it for demand forecasting.  
**Herbert Gomes Miranda:** Okay, that's great.  
**Davis Gallagher:** Sweet. Um, we'll focus on that probably towards the end of this week or beginning of next week. I wouldn't call that a high priority action right now.  
   
 

### 00:20:21 {#00:20:21}

   
**Davis Gallagher:** Just flagging it for our review as we start to push forward on the AX integration. Um, cool. And then the last piece is Yale. Um I think we're we're all good. Any anybody else have anything on Milcat or are we good to go?  
**Lucas Inacio Luz:** and love for my  
**Davis Gallagher:** Um so on Yale, like I said, really appreciate the the push to to get everything in a good place. I think the only thing that is outstanding for us is to connect the uh back end to the front end. Herbert, I know you did a great job explaining all the different values we've we've computed um and sent it over to myself and Jigasha to pull through the front end. Um if we could do that by the end of this week, that would be great because the the primary thing that we just need feedback on from Yale right now is that they're in alignment with how we've structured the wireframe or the UI. I again I think it's fully on board with how I'd want to use it in their role, but we'll confirm that.  
   
 

### 00:21:28 {#00:21:28}

   
**Davis Gallagher:** So, uh targeting end of this week to integrate the front end and the back end um from a data perspective because right now we're just using static mock data in the front end. Um and then the only other piece is just a few adjustments in terms of the business logic. Herbert, I already know you outlined those and like I said, it's not a high priority to finish in the next couple days. It's just an end of week task. So, um that's those are the big ones. And then for the open questions for Yale, number one is we're currently not using work order data or written order data. They have these two invoice types. They have um invoice type which is closed. Invoice type which is written order. Written order is essentially their salesperson keying in that I think this order is going to close the next 90 days. Um we're not using that in our data right now uh because it's not an accurate signal. Um, and Joe mentioned last week that right now they're assuming in their process that 30% of open work orders close as an actual sale.  
   
 

### 00:22:21 {#00:22:21}

   
**Davis Gallagher:** So I have it as an open question to Joe if we want to use that same assumption or if he would prefer us not to directly leverage written order data. I think it's better for us to try not to. I think it gets a little dangerous when we start assuming that 30% of those convert, especially because there's variability. like a salesperson can quite literally change a written order one day into another one. And so that the forecast will be a bit volatile. So I I'm personally against doing that. Uh but we'll confirm that with Joe. And then the last piece, this is Lucas, where I'll probably have to loop you in a little bit more, is there also is part of an ask AI component or a knowledge assistant component to this. Um my assumption is that this is very similar to toen in a way. It's just for them to be able to ask more defined questions to their data and get answers quicker than they would doing reports, but I don't have a clear understanding of what kind of key business questions they want the knowledge assistant to answer, what kind of reports they're building today.  
   
 

### 00:23:16 {#00:23:16}

   
**Davis Gallagher:** So, I need to to work with them to to further define that. But those are the big things. Like I said, knocking out the the stuff we have by the end of this week and then we'll validate those two points and hopefully be able to focus on them next week. But we're in good shape for that now. Um, we talked about having the prototype finished by April 22nd and we're we're definitely tracking to that. So, again, appreciate the the push to get everything in a good place.  
**Lucas Inacio Luz:** Uh, sure. Sounds good. And do you have uh they have like a database or we are going to get the information from files or anything like  
**Davis Gallagher:** Yeah, we're going to be getting the information from files. Right now,  
**Lucas Inacio Luz:** that?  
**Davis Gallagher:** they're doing a scheduled push of five different CSVs to our S S3 bucket uh every Sunday night. Um, and that's essentially a snapshot of their inventory, their sales, uh, their current models that they're transitioning, and a few a few additional details.  
   
 

### 00:24:15 {#00:24:15}

   
**Davis Gallagher:** So, we'll be it'll just be CSV files that we're getting on a weekly basis.  
**Lucas Inacio Luz:** Yeah. Okay, got it. Thank you.  
**Davis Gallagher:** Yep. No  
**Herbert Gomes Miranda:** So, so Davis, uh, you mentioned, uh, CSV.  
**Davis Gallagher:** problem.  
**Herbert Gomes Miranda:** That's one thing that I would like to maybe ask you to ask them. I don't know if it's possible, but, uh, they're actually not sending us CSV files.  
**Davis Gallagher:** Oh,  
**Herbert Gomes Miranda:** They are sending They are sending us .txt  
**Davis Gallagher:** they lx.  
**Herbert Gomes Miranda:** files, text files.  
**Davis Gallagher:** Oh.  
**Herbert Gomes Miranda:** Yes. And I've I've been I've been doing some like fuzzy work here because the I let me check I think it's five or six different models that we get. Um the names are written sales uh weekly inventory model file and finished sales.  
**Davis Gallagher:** Yep.  
**Herbert Gomes Miranda:** So they send us txt files for those. And I think for most of them it's literally CSV. It's comma separated.  
   
 

### 00:25:20 {#00:25:20}

   
**Herbert Gomes Miranda:** No, I think only the model file is comma separated and the other ones are separated by a a bar. That's that's not a that's not the problem.  
**Davis Gallagher:** Mhm. Yeah.  
**Herbert Gomes Miranda:** But the problem is that with the commaepparated um values for the model file uh the model file file because the name of the model the file is model file uh they have some like uh wrong lines faulty lines because of the because they have commas inside the values so if possible I don't know how hard is it is it for them I mean My logic is working. I I've made some some adjustments here to work for all cases. But if possible, if they can send us like the C the CSV files, it will be easier and more reliable, I guess.  
**Davis Gallagher:** Yep. Thank you for flagging that. I can definitely raise that to to Jeff. Jeff is their primary IT stakeholder. I'll raise that to him.  
**Herbert Gomes Miranda:** Okay. Yeah, if possible, I think sending us CSVs would be more uh reliable because they can say for example that we lost some information because of the  
   
 

### 00:26:31

   
**Davis Gallagher:** Great.  
**Herbert Gomes Miranda:** conversion. Like I sent you the the right the right txt, you may have done something wrong and your CSV is not right. So yeah, maybe if if they can send us the the CSV, it will be better.  
**Davis Gallagher:** Yep, I agreed. I thought they were I thought they were. So, uh, thank you for raising that. Cool. Um, I think that's it from my side. Anything else from from you guys?  
**Herbert Gomes Miranda:** No, I I just show my screen really quickly here so you can see what I'm I'm talking about. So this this is the the txt file that we get. For example, this finish sales, it has like these bars here that separate the values and so finish sales. Uh, and this model file here also this is the CSV. You see it it's saying like malfformation.  
**Davis Gallagher:** Mhm.  
**Herbert Gomes Miranda:** Uh but this problem is only within the platform because if I if I download this file or if I load it on Python, it will work.  
   
 

### 00:27:54 {#00:27:54}

   
**Herbert Gomes Miranda:** So maybe this is a platform showing it  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** wrong. So yeah, this this one is with commas. You see?  
**Davis Gallagher:** Oh  
**Herbert Gomes Miranda:** Yeah,  
**Davis Gallagher:** yeah.  
**Herbert Gomes Miranda:** this is the only one with commas, I guess. Uh let me check the other run here.  
**Davis Gallagher:** Yeah. All the other ones are bar separators.  
**Herbert Gomes Miranda:** Yes. Yes. Or is Yeah. Yes. So we are having some problems with this one this model file here because of the commas inside the values.  
**Davis Gallagher:** Yeah, it's a good call out. It's important with the model file because that'll be where we get whether the product is on the sell plan or not and that'll affect our assumption of if they're holding safety stock or not. So, uh definitely want to make sure that we get this in the right format.  
**Herbert Gomes Miranda:** Yeah. Okay. That's what I had to  
**Davis Gallagher:** Sweet. Cool. Everything else clear from like a a task bandwidth  
**Herbert Gomes Miranda:** say.  
**Davis Gallagher:** perspective. Okay, cool. Well, uh I appreciate you guys hopping on.  
**Herbert Gomes Miranda:** Okay. Thank you.  
   
 

### Transcription ended after 00:29:43

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*