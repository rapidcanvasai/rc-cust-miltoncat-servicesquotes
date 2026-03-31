# 📝 Notes

Mar 16, 2026

## \[Internal\] MiltonCAT and Yale Sync

Invited [Jigisha Rojasara](mailto:jigisha@rapidcanvas.ai) [Lucas Inacio Luz](mailto:lucas.inacio@rapidcanvas.ai) [Fuge Zou](mailto:fuge@rapidcanvas.ai) [Davis Gallagher](mailto:davis@rapidcanvas.ai) [Herbert Gomes Miranda](mailto:herbert@rapidcanvas.ai) ~~[Ray Hsu](mailto:ray@rapidcanvas.ai)~~

Attachments [\[Internal\] MiltonCAT and Yale Sync](https://www.google.com/calendar/event?eid=azA4NzQ4ZXM2Nmt2cW5uMTBkcXZiYXR1aXVfMjAyNjAzMTZUMTUzMDAwWiBkYXZpc0ByYXBpZGNhbnZhcy5haQ) 

Meeting records [Transcript](?tab=t.fti6ccr8bsy3) 

### Summary

Team alignment with client projects established a phased Milton Cat go-live plan for AX integration, with demand forecasting model adjustments and Yale Appliance development initiated.

**Phased Milton Cat Go-Live**  
The Milton Cat project will utilize a phased go-live plan due to anticipated delays in securing read and write access to AX, using SFTP for initial file exchange. Phase 1 will leverage the current architecture, with Phase 2 focusing on production integration once AX is accessible.

**Milton Cat Demand Model Updates**  
Demand forecasting requires 2 minor adjustments, updating supplier lead times and incorporating Months of Sale (MOS) safety stock into the reorder logic. The reorder recommendation should now occur when projected inventory falls below the safety stock threshold, instead of at 0 quantity on hand.

**New Yale Appliance Project Kickoff**  
Development began for the new Yale Appliance client, focusing on the demand forecast model which includes an Ask AI component. The team needs to confirm the required workflow and offline functionality for both the mobile and desktop applications.

### Details

* **Team Introductions and Client Overview**: The meeting began with welcoming Lucas Inacio Luz back from time off and a brief discussion of the team members' weekends, which included family visits for a nice recharge ([00:00:00](#00:00:00)). The team was informed that they would function as a pod for two clients, Milton Cat and Yale Appliance, because the solutions for both—demand forecasting and inventory optimization—are very similar, allowing for the leveraging of learnings between projects ([00:01:27](#00:01:27)).

* **Milton Cat Project Scope and Phased Go-Live**: The primary goal for the meeting was to align the team on the current week's action items for Milton Cat’s demand forecasting and services quote automation tool, and to initiate development for Yale's demand forecasting solution. For Milton Cat, a phased go-live plan was established due to delays in getting read and write access to AX from the client’s IT side, with read access anticipated in one month and write access in two months ([00:02:25](#00:02:25)). Phase one will use the current architecture where files are dropped into SFTP, and phase two will focus on production integration once AX is accessible ([00:03:31](#00:03:31)).

* **Milton Cat Demand Forecasting Updates**: Herbert Gomes Miranda was asked to take the lead on two minor adjustments for the demand forecasting model ahead of the Wednesday meeting. The first task is to update the supplier lead times in the system using a new file received from the client ([00:04:17](#00:04:17)). The second task involves incorporating safety stock data, referred to as Months of Sale (MOS), which defines the inventory threshold for each SKU. The reorder recommendation should now occur when the projected inventory falls below the defined safety stock threshold, rather than at zero quantity on hand ([00:05:16](#00:05:16)).

* **Milton Cat Dodge Data Investigation**: The team discussed an inconsistency where Dodge data, projected at the subcategory level, was only applied to some SKUs within a particular subcategory, and Herbert Gomes Miranda committed to investigating this issue ([00:06:26](#00:06:26)). The findings are necessary to clearly define how the calculation is performed, which will then inform how visual indicators are surfaced to users regarding potential demand spikes ([00:07:30](#00:07:30)).

* **Milton Cat Services Quote Automation Logic Refinement**: Lucas Inacio Luz was assigned to update the logic for the services quote automation tool, based on a newly created Jira board. This involves making necessary adjustments to the confidence scoring, similarity scoring, and the overall quote generation logic to align with tighter business definitions ([00:08:19](#00:08:19)). Lucas Inacio Luz confirmed they would review the logic and provide feedback if necessary ([00:09:30](#00:09:30)).

* **Milton Cat UI Updates for Reflexive Analytics**: Davis Gallagher detailed client feedback requesting that the dashboard analytics be more informative than redundant ([00:10:24](#00:10:24)). The client requested that the displayed analytics should become reflexive, showing the most common job and component code combinations based on user-selected attributes, such as machine model and serial prefix ([00:11:23](#00:11:23)). Given that a demo is scheduled for the next day, it was agreed that if the team cannot implement the changes to allow for this dynamic filtering, the existing redundant analytics should be removed, and the feature added to the roadmap ([00:12:36](#00:12:36)).

* **Milton Cat Workflow and Mobile App Considerations**: The team needs to align with the client on the workflow between the mobile and desktop applications, especially considering that the AX integration will necessitate using SFTP and CSV exports as a temporary solution for the services automation tool ([00:14:54](#00:14:54)). Herbert Gomes Miranda mentioned a potential requirement for the mobile app to work without internet access, enabling the generation of quotes in the field ([00:20:42](#00:20:42)). Davis Gallagher will confirm the required workflow and offline functionality with the client to ensure the correct approach is taken for implementation ([00:14:54](#00:14:54)) ([00:21:57](#00:21:57)).

* **Kickoff and Task Assignment for Yale Appliance**: Yale Appliance is the new client, with work just entering the development phase ([00:15:49](#00:15:49)). Fuge Zou completed the initial demand forecast model, which is highly similar to the Milton Cat model but includes an Ask AI component. Herbert Gomes Miranda is slated to own the demand forecasting side, while Lucas Inacio Luz will primarily handle the Ask AI piece, with both encouraged to collaborate on the initial demand forecast ([00:16:52](#00:16:52)).

* **Yale Appliance Development and Workload Balancing**: The immediate task is to begin implementing the demand forecast into the rapid canvas application ([00:16:52](#00:16:52)). The client's lack of strong opinions allows the team to drive the solution and solicit feedback ([00:17:57](#00:17:57)). Davis Gallagher and Fuge Zou emphasized the need to balance the workload, giving Lucas Inacio Luz and Herbert Gomes Miranda the freedom to decide where they focus their efforts between Milton Cat and Yale ([00:19:01](#00:19:01)).

### Suggested next steps

- [ ] Herbert Gomes Miranda will adjust the supplier lead times being populated in the system with the new updated lead times file from Ry.  
- [ ] Herbert Gomes Miranda will incorporate the safety stock data (MOS) to recommend a reorder when the projected inventory on hand is below the safety stock threshold defined in the file.  
- [ ] Herbert Gomes Miranda will investigate why some SKUs had a Dodge data forecast and others did not, and provide a clear line of sight into how the calculation is being done.  
- [ ] Lucas Inacio Luz will update the confidence scoring, similarity scoring, and quote generation logic as defined in the Jira board task.  
- [ ] Davis Gallagher will finalize the prototype wireframe for the Yale demand forecast application.  
- [ ] Lucas Inacio Luz and Jigisha Rojasara will try to implement the requested UI update for the services code automation by the meeting tomorrow, or remove the redundant analytics from the right-hand side.  
- [ ] Davis Gallagher will confirm with Tim tomorrow the expected workflow for the services automation app (including whether it needs to work without internet access) and then Lucas Inacio Luz will loop in Jigisha Rojasara to ensure the right approach is taken to implement the mobile web app.  
- [ ] Herbert Gomes Miranda and Lucas Inacio Luz will begin putting the Yale demand forecast into the rapid canvas app.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*Please provide feedback about using Gemini to take notes in a [short survey.](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=qAXnpV63s5LGxIZebFpsDxITOAIIigIgABgBCA&detailid=standard)*

# 📖 Transcript

Mar 16, 2026

## \[Internal\] MiltonCAT and Yale Sync \- Transcript

### 00:00:00 {#00:00:00}

   
**Jigisha Rojasara:** Hey. Hi.  
**Fuge Zou:** Hello Ja. Hello. Hello. Uh S. Davis is coming here in a minute.  
**Jigisha Rojasara:** Yep.  
**Fuge Zou:** Um,  
**Lucas Inacio Luz:** Hello guys.  
**Davis Gallagher:** Welcome back,  
**Lucas Inacio Luz:** Thank you.  
**Fuge Zou:** welcome back,  
**Davis Gallagher:** Lucas.  
**Fuge Zou:** Lucas. Thank you.  
**Lucas Inacio Luz:** Thank you guys.  
**Jigisha Rojasara:** Hey  
**Davis Gallagher:** Yeah. Yeah. How was the How was the time off?  
**Lucas Inacio Luz:** was really really cool. I was needing that. So now I'm fully charging.  
**Davis Gallagher:** Awesome. Awesome. I'm glad to hear that. Hey, Herbert. Hey, Jigisha. Thanks. Uh, thank you both for joining.  
**Jigisha Rojasara:** everyone.  
**Davis Gallagher:** How was everybody's weekend?  
**Herbert Gomes Miranda:** Great. Great.  
**Davis Gallagher:** Good to hear. Anything uh anything fun on the docket?  
**Herbert Gomes Miranda:** I I don't think so. Just went to my mother's house and my grandmother's house, too. So, yeah, just visiting the family.  
   
 

### 00:01:27 {#00:01:27}

   
**Davis Gallagher:** Oh, sweet. That's nice. Always good to have some family time. I did the same thing. I went to go see my mom and my brothers this weekend, so it was a nice recharge.  
**Herbert Gomes Miranda:** Do they live in the same city?  
**Davis Gallagher:** Uh close about a 45 minute drive. So, just hopped in my car and got up there and spent the weekend there.  
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** Cool. All right. Well, well, thank you for joining, guys. Um, I think as you see, I changed the meeting title, extended this a little bit. Um, we're going to be, this is going to kind of be our pod for for two different clients. We've got Milton Cat and we've got Yale Appliance. And the reason that we've put these all together is that, uh, what we're doing for Yale Appliance is very similar to what we're doing for Milton Cat. It's a demand forecasting, inventory optimization solution. and a lot of the learnings that we've had in terms of developing both the UI and the actual backend for that project we can leverage here for Yale.  
   
 

### 00:02:25 {#00:02:25}

   
**Davis Gallagher:** So that's why we brought all of us together uh for these two clients. Um, and you know, I don't think we'll actually need all 45 minutes today, but what I wanted to do is just make sure that we're all on the same page in terms of the big kind of uh action items to cover this week for Milton Cat's demand forecasting and services quote automation tool and then also for beginning the sprint development for for Yale's demand forecasting solution. So, um, before I go, does that all make sense? You guys have any questions so far? Okay, sweet. Um, on the demand forecasting side, um, and the services quote automation side, I just want to make you guys all aware that I've put together kind of like a success criteria UAT and go live timeline for both of those. We are going to be doing a phased go live for these uh because we have a constraint on the client side. uh they are trying to give us access to AX for read and write permissions. It's been slow on their IT side.  
   
 

### 00:03:31 {#00:03:31}

   
**Davis Gallagher:** They're hoping that we get read access in the next month and write access in the next two months. And so as a stopgap solution for our go live, we'll have a phase one where we're going to stick with the same architecture we're using now where they're going to drop all their files into SFTP and we'll you know either export those to a CSV that they can access or we'll just leave it as is in the system for now. And then phase two will be focused on uh the actual production once we get AX integration. So from a functionality lens, I don't think much is going to change between those two phases. It's just being able to make sure that as we integrate into those systems, there's going to be no bugs, no changes. But we're in good shape for both of those. Um but would we appreciate you guys giving the the documents I sent those in all of our Slack channels a quick review so we're all on the same page in terms of what the timeline looks like.  
   
 

### 00:04:17 {#00:04:17}

   
**Davis Gallagher:** Um but I'll I'll start with Milton Cap first. I think there's there's two pieces and uh Lucas Herbert would appreciate your guys' feedback here as I walk through this. This is just my initial plans, but I think Herbert um on the demand forecasting side would love for you to take the lead on a couple open action items that we can implement prior to our meeting on Wednesday. Um they're they're pretty minor adjustments. The first is we got a new file from uh Ry, which is the updated supplier lead times. eventually these are going to change probably month every month every two months. Um I sent that file into our Slack channel. So if you could just adjust the supplier lead times that are being populated in the system with that new updated lead times that would be ask number one. Um cool and then ask number two would be I know we right now I don't think are we I guess are we using a safety stock assumption or are we not incorporating safety stock at all into the model?  
   
 

### 00:05:16 {#00:05:16}

   
**Herbert Gomes Miranda:** Uh, no, not yet.  
**Davis Gallagher:** Okay. Um, they did send us safety stock data. So, in that same Slack message, they call it MOS, uh, which is, I guess, months of sale. And essentially, that's a process that they do with CAT twice a year where they define for each skew specifically how much they want to hold of inventory at the Milton Cat warehouse. And Rey sent that document to us. And again, it's at the at the per skew level. So, I'd love for us to essentially incorporate the safety stock to say once the projected inventory on hand uh based on our forward-looking forecast is going below the safety stock threshold, that's when we recommend a reorder. Um, so would love to incorporate that. Does that make sense?  
**Herbert Gomes Miranda:** Yes. Okay.  
**Davis Gallagher:** Okay, perfect. So yeah, rather than a reorder being at quantity zero on hand, it would be at the quantity defined in their safety stock file.  
**Herbert Gomes Miranda:** Okay.  
**Davis Gallagher:** If we got anything else to add on that or you think that's pretty straightforward?  
   
 

### 00:06:26 {#00:06:26}

   
**Fuge Zou:** Uh, pretty straightforward.  
**Davis Gallagher:** Okay, cool. Um, and then the last piece, we're still awaiting client feedback on this. uh their primary tester Andy told me he'd sent me uh his feedback. I haven't received it yet, but once we get that, the other piece will be implementing that skew hierarchy. Um so that we have a clear uh grouping together of legacy and new SKUs. Um but but we're waiting feedback on that. I imagine that'll be later in this week. Um otherwise I think the only other things we wanted to discuss on the demand forecasting was the Dodge data and I think what we had mentioned was that the Dodge data was projected at subcategory level but I had seen in the dashboard that some SKs had Dodge data some SKs in a particular subcategory had a Dodge data forecast to them others didn't. So, I wanted to see if we've had a chance to investigate that because I want uh Jigisha to be able to create some visualizations that show a user that a specific subcategory might have a demand spike based on the dodge data.  
   
 

### 00:07:30 {#00:07:30}

   
**Davis Gallagher:** So, I wanted to check in on  
**Herbert Gomes Miranda:** Yeah, I I need to take a look on that. I I said in the channel that I was going to look,  
**Davis Gallagher:** that.  
**Herbert Gomes Miranda:** but I I sorry, I I forgot about it because uh I I did the the other tasks last week. So that I I forgot about that. Sorry. But I'll take a look at it.  
**Davis Gallagher:** Okay. Yeah, if you could if you could take a look at that and then just give us a a clear kind of line of sight into how that's being calculated, it'd be great because that'll feed into how we surface the indicators or the visual indicators to a  
**Herbert Gomes Miranda:** Okay.  
**Davis Gallagher:** user that we see we might see a demand spike for it.  
**Herbert Gomes Miranda:** Okay. I'll do it.  
**Davis Gallagher:** Okay, thank you. Cool. I think that's it on the demand forecasting side. the services code automation side. Uh Lucas is where I' ask for your help.  
   
 

### 00:08:19 {#00:08:19}

   
**Davis Gallagher:** I know you've you've let a lot of that early stage development for it. And so uh I created a Jira board that we'll use moving forward and I'll assign these to you so that's it's clear. Um but the first thing is that uh we did finally receive the parts data from Tim and Herbert was able to join the parts data table with the work order history table. Um so we've we've put those two together and built that similarity score. Um what I had kind of worked a little bit on on Friday is uh what we were doing originally is that the similarity score wasn't being used at all for quote generation and um the confidence score also need to be adjusted. So essentially um you know there were some min minor changes to both the similarity score and the confidence scoring that I think and as well as quote generation logic that I think would lead to uh more a better business outcome. Essentially I'd kind of tight more tightly define the business logic for how we calculate the similarity score how we calculate the confidence score and how a similarity score may or may not pull through to the generated quote that we're displaying.  
   
 

### 00:09:30 {#00:09:30}

   
**Davis Gallagher:** Uh I've defined those in the jer board. Uh it's it's as as much definition as I can. Um but would ask Lucas if you could take forward the updates to the competence scoring, similarity scoring, and the quote generation as defined in that task. That would be that would be  
**Lucas Inacio Luz:** Yeah, I can I can take a look on that.  
**Davis Gallagher:** great.  
**Lucas Inacio Luz:** Um, I was just wondering uh where exactly is our latest uh data app because I think we have like three versions right now. So I don't know if you have updated one of those.  
**Herbert Gomes Miranda:** Yeah, the latest one is before. I I'll delete the other  
**Lucas Inacio Luz:** Okay,  
**Herbert Gomes Miranda:** ones.  
**Lucas Inacio Luz:** got it. Uh, okay. So, I will take a look at it.  
**Davis Gallagher:** Okay. Thank you. Yeah. And Lucas, as you're as you're looking through the kind of the the logic that I defined,  
**Lucas Inacio Luz:** Sure,  
**Davis Gallagher:** I tried to make it as simple as I could from a business user perspective to kind of match how I thought Tim and the services team would want it to pull through.  
   
 

### 00:10:24 {#00:10:24}

   
**Davis Gallagher:** But uh feel free to like if you think some things don't make sense or if you think some things need refinement like let's work through that together. Would value your feedback as well.  
**Lucas Inacio Luz:** I'll keep you updated.  
**Davis Gallagher:** Okay. Thank you. Um and then the second piece on that is some updates to the UI. I think uh right now and I'll give I give this context to Jigasha but I'll I'll give it to us here quickly uh as I share my screen. Um Here we go. So what we had heard from Tim essentially was that you know this these analytics on the right hand side like he knows very well like as the business he knows that 255s are the top model by record count. He knows that we do a lot of 540 job codes and he knows that the top component codes are often 7,000. His his feedback was essentially like I know all of this already and I'd like it to be something that helps me be more informed versus something that I already know.  
   
 

### 00:11:23 {#00:11:23}

   
**Davis Gallagher:** And so what he essentially asked was if we could um do and I'll I'll show a quick example um is when we have a user select certain attributes display a different set of analytics on the right hand side. So when nothing is selected nothing would show up but essentially when a user clicks 250 for the machine model and 5L2 for the serial prefix you'd have three sets of analytics show up on the right hand side. The first is for this particular machine model and serial prefix combo, what are the most common job code and component code combinations? So for 255L2, what are the most common combinations between job code and component code? That would be number one. Number two would be a smaller subset of that. For machine model 250 serial prefix 5L2, what are my most common job codes? And for machine and the next one would be for machine model 250 serial prefix 5 L2 what are my most common component codes. So at the top would be for these two what are the most common combinations of these two below that for these two what would be the most common of this attribute and then finally below that for these two would be the most common of this attribute.  
   
 

### 00:12:36 {#00:12:36}

   
**Davis Gallagher:** So that's what he essentially asked and I know um I guess wanted to see how if we are structured on the back end to be able to do that sort of those sort of reflexive analytics.  
**Lucas Inacio Luz:** Um I mean I think right now we we're kind of manipulating the JSON files inside the the front end. I think it's not the right way to do that because we were not uh getting the the data from their system. I don't know if it it is ax or something else but the way we have like now we are just kind of getting this information from the the the front end. So um I think you mentioned that should be done for tomorrow right?  
**Davis Gallagher:** Yeah, we have a demo with them tomorrow just to walk through this with their their VP of services. If if we could make a change so that those types of filters could be possible on the right hand side by then that would be awesome. Uh if not, my recommendation or my my thought would be that we just remove these for now.  
   
 

### 00:13:53

   
**Davis Gallagher:** Uh because he he already mentioned that they're redundant.  
**Lucas Inacio Luz:** Mhm.  
**Davis Gallagher:** So we have no analytics display on the righthand side and we we mentioned to him that we'll work on having those analytics show up throughout the course of the week.  
**Lucas Inacio Luz:** Yeah.  
**Davis Gallagher:** Um does that make sense?  
**Lucas Inacio Luz:** Yeah, it makes sense for me.  
**Davis Gallagher:** Okay. So, should I should should we expect that we'll try to get this working uh as I described it by that meeting? And if that doesn't work out, Lucas, maybe Lucas and Jagisha, you guys can send me a message tomorrow morning or tomorrow afternoon saying, "Hey, I don't think we get it in time." Like, we'll just kind of ax these on the right hand side and we'll build it in as a roadmap item for this week. Does that make sense?  
**Lucas Inacio Luz:** Yeah. Here. I wait.  
**Davis Gallagher:** Okay, cool.  
**Jigisha Rojasara:** Turn.  
**Davis Gallagher:** Perfect. Um, so we're good there. Um, let's see. And the only other thing we're going to do in the demo is there's a couple considerations from a workflow workflow perspective about this solution.  
   
 

### 00:14:54 {#00:14:54}

   
**Davis Gallagher:** Um, so as I was going back to Lucas, we're going to have a phased go live. Like the AX integration is just going to be a pain in the ass. So, we're going to have to use SFTP as our stop gap solution and probably exporting to a CSV as our our output for the services automation tool in the next month, month and a half. That'll be our our primary architecture structure. Um, and what we need to align with the client on is the workflow between the mobile app and the desktop app. Ray had mentioned to me that, you know, I think in his vision, the mobile app would be where somebody in the field generates a quote. Um, and then on the desktop, a user could approve the quotes that were generated by those that are in the field. I don't think I have a solid understanding of that workflow. So, we're going to walk through that with them as well tomorrow, and that'll probably lead to some enhancements to the solution in terms of certain displays and certain functionality.  
   
 

### 00:15:49 {#00:15:49}

   
**Davis Gallagher:** Uh, but nothing yet to change. Just wanted to flag that we're going to be walking through that.  
**Lucas Inacio Luz:** U okay so basically the idea is is try to create two versions one is like an app that you can install on a smartphone and they can use it and the the other one is uh they using the rapid platform for example that's the the main idea okay got  
**Davis Gallagher:** Yep. Yep. I think so. But we'll we'll confirm that tomorrow. Cool. I think that's all I've got from the Milton cat side. Everybody clear? in terms of next steps.  
**Herbert Gomes Miranda:** This  
**Lucas Inacio Luz:** Yep.  
**Davis Gallagher:** Okay, awesome. Um, on the Yale side, um, this is going to be the new one that we're all working on together. Fuga and I just got off a call with the client. Uh, we we just kind of kicked off and we're just getting into the development phase. Um, so Fuga created the initial uh, demand forecast model.  
   
 

### 00:16:52 {#00:16:52}

   
**Davis Gallagher:** Um I think he sent a chat uh or a message in our chat with all those files. Like I said, it's very similar to Milton Cat with just an ask AI component on top. So similar to what we're doing with Topan Lucas. I'm thinking that um Herbert you can own a lot of the demand forecast side just because you've been tied with Milton Cap pretty closely. And then Lucas, you can own kind of the ASKAI piece. Um as we start to build that out, I think the ASK AI is a bit more downstream. The primary focus right now is the demand forecast. So maybe both of you guys could work on owning that um and you know split up between the demand forecasting aski components uh as required. I trust both of your judgments in terms of of that. So um high level FUGA created the initial demand forecast model. I created kind of a quick prototype uh of a wireframe. Um the ask would be that we start putting the demand forecast in the rapid canvas app and then once I finalize the wireframe I can send that over to you Jigisha and we can put that in the app as well um to get it to get it at least from a V1 like beta perspective live.  
   
 

### 00:17:57 {#00:17:57}

   
**Davis Gallagher:** Um I need to do some more work on the prototype wireframe uh before I think it's ready to go but the forecast itself is has all been completed by Fuga. So, if we could get started on putting the the forecast uh and everything that's associated with that into the app, uh that would be great. I don't think we have a Do we have a workspace? Let's see. We do have a workspace.  
**Fuge Zou:** Yes, we do.  
**Davis Gallagher:** Uh yeah.  
**Fuge Zou:** Yes, we do. Uh we can utilizing when share that to also um this one we have more control  
**Davis Gallagher:** Yeah.  
**Fuge Zou:** on the US side. I feel like customer is not that don't have a strong opinion. they are a little bit passive which is we can drive as much as we can and solicit their feedback right um it is 80% similar but 20% slightly different like some minor details they like this written like business written this 90-day grace period or some um but for most part it is u very similar logic so um however um you can feel free to take a look and um once u David is finalizing the wireframe let's work on a sprint to make that happen and make it real.  
   
 

### 00:19:01 {#00:19:01}

   
**Fuge Zou:** Um yeah  
**Davis Gallagher:** Cool.  
**Fuge Zou:** and I think we have both Lucas and Herbert helping so we can balance the the workload so nobody gets burned out.  
**Herbert Gomes Miranda:** Okay.  
**Fuge Zou:** Um maybe um Lucas um Harbert feel free to just u make options right. Um either you want to stay stay on um Milton Car or you want to um just work on the yo yo feel free to to to to decide yourself. I I I gave you some freedom, right? You can you can pick whichever you want to work, but um um we we definitely want to balance the workloads between um you know, between us. Uh between us. Yeah. Thank you.  
**Herbert Gomes Miranda:** Thank you. Thank you for that.  
**Lucas Inacio Luz:** Okay.  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** Do you already have a um not a not an environment? I think it's um the workspace for  
**Davis Gallagher:** Yep.  
**Herbert Gomes Miranda:** Yale.  
**Davis Gallagher:** We do.  
**Fuge Zou:** Yeah. Yeah, we do.  
**Davis Gallagher:** I just invited you,  
   
 

### 00:19:57

   
**Fuge Zou:** Let me let me post.  
**Davis Gallagher:** you and Lucas, to it.  
**Fuge Zou:** Let me write two boss.  
**Davis Gallagher:** Fuga,  
**Herbert Gomes Miranda:** Okay.  
**Davis Gallagher:** I just I just invited him,  
**Fuge Zou:** Okay.  
**Herbert Gomes Miranda:** Thank you.  
**Fuge Zou:** Okay. Okay.  
**Herbert Gomes Miranda:** Thank you.  
**Davis Gallagher:** so we're in good shape. Yeah, to Fuga's point, I know we we've got a lot going on, so um as we're we're talking about splitting up tasks, splitting up things, please just let me know. Um if if bandwidth is tight or if we need to adjust things, uh happy to to talk through that. So, let's keep close and let's just let's stay open and uh and give each other feedback as we need. Um because you know from my perspective this is going to be it's it's iterative. There's going to be a lot in flux. There's going to be a lot of changes. There's going to be a lot of and I know you guys have a big workload. So I want to be as helpful as I can to make sure that we manage that all together.  
   
 

### 00:20:42 {#00:20:42}

   
**Herbert Gomes Miranda:** Thank you. Okay.  
**Davis Gallagher:** Yeah. Absolutely. Cool. Okay. I think that is it for me. Uh I don't think I have much more. Anything else, Fuga, that you want to add or uh Lucas, Herbert, Chigisha, anything else you guys have on top of your  
**Fuge Zou:** Um,  
**Lucas Inacio Luz:** And I just make sorry if we're going to go ahead.  
**Davis Gallagher:** mind?  
**Fuge Zou:** please go ahead.  
**Lucas Inacio Luz:** Okay. So, uh I just want to make make sure that we can build some uh stalable mobile apps for uh the clients because I don't remember uh if we do that uh in some time on the the time because uh at least it's new for me. So, I ask for to help us on that.  
**Davis Gallagher:** Yep.  
**Herbert Gomes Miranda:** Uh actually I don't from what I remember at the beginning of this project I don't remember if it's it's really needed a like mobile app. Uh, but something the client said, I I might I might be wrong, but uh maybe the guys at the field won't always have internet access.  
   
 

### 00:21:57 {#00:21:57}

   
**Herbert Gomes Miranda:** So, one of the requirements was that the app would work without internet. I maybe we have to check that again, but I think that's the case. Not every time the user would have internet access.  
**Davis Gallagher:** That's  
**Herbert Gomes Miranda:** So we would need to be able to generate quotes without  
**Davis Gallagher:** a  
**Herbert Gomes Miranda:** internet.  
**Davis Gallagher:** Yep, that's a a good call out. I'm gonna want to confirm that with Tim tomorrow. Um, I also think that we won't necessarily need a fullscale app. As long as the user can access the web app through their mobile device. Um, even if it's just a a website link on their phone, that works too. Um, but to your point, Lucas, like from a a UI perspective and actual deployment of a web app for mobile, I don't I don't have experience with that either. So um I'll validate Herbert that workflow that you mentioned tomorrow and then once we get a thumbs up on hey this is how we expect people in the field to be using it I'll start looping a new just to make sure that we have the uh the right approach to implement that.  
**Lucas Inacio Luz:** Cool. Thank you, Davis.  
**Davis Gallagher:** Yeah thanks for calling that out. Cool. All right.  
**Jigisha Rojasara:** I  
   
 

### Transcription ended after 00:23:58

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*