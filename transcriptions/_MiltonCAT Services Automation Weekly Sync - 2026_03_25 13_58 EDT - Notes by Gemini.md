# 📝 Notes

Mar 25, 2026

##  MiltonCAT Services Automation Weekly Sync

Invited [Lucas Inacio Luz](mailto:lucas.inacio@rapidcanvas.ai) [Fuge Zou](mailto:fuge@rapidcanvas.ai) [Ray Hsu](mailto:ray@rapidcanvas.ai) [Davis Gallagher](mailto:davis@rapidcanvas.ai) [Herbert Gomes Miranda](mailto:herbert@rapidcanvas.ai) [tim\_dailey@miltoncat.com](mailto:tim_dailey@miltoncat.com)

Attachments [ MiltonCAT Services Automation Weekly Sync](https://www.google.com/calendar/event?eid=NGhnbDRtcWRxYWk0NDRyNzFnM2ZscGRkNHBfMjAyNjAzMjVUMTgwMDAwWiBkYXZpc0ByYXBpZGNhbnZhcy5haQ) 

Meeting records [Transcript](?tab=t.f4vkutcmdndn) 

### Summary

ERP project status confirmed the March 2027 go-live date with specifications submitted for demand forecasting and claims to PO use cases.

**ERP Go-Live Date Confirmed**  
The tentative ERP system go-live date is confirmed for mid-March 2027\. Developers have received the specifications for demand forecasting and claims to purchase order use cases.

**AX Data Integration Strategy**  
The team decided on an approach to handle the massive AX data volume by providing historical raw data in multiple sources initially, followed by new transactions only. A meeting will be scheduled to establish a timeline for data transfer to and from AX.

**Mobile UI and Success Criteria**  
The team settled on a single data application architecture for mobile and desktop access that allows for offline data caching and quoting. The proposed UAT plan and success criteria document require Josh’s final approval.

### Details

* **ERP Go-Live Timeline and Status**: Tim Dailey confirmed that the tentative go-live date for the ERP system is the middle of March 2027, about a year from the meeting date, noting that things are proceeding as smoothly as possible for a project of that nature ([00:00:00](#00:00:00)).

* **AX Integration and Data Specifications**: Davis Gallagher thanked Tim Dailey for assistance with the AX system, which provided helpful context. Tim Dailey confirmed that the necessary specifications have been submitted to developers, and they plan to use a framework involving logic apps, similar to the inventory process, to push data to Davis Gallagher's team first ([00:01:06](#00:01:06)). Davis Gallagher committed to scheduling a meeting for the following week with Tim Dailey, Glenn, and Ray to establish a timeline and determine how the data will be transferred back to AX ([00:01:56](#00:01:56)).

* **Data Volume and Delivery Approach**: Due to the massive size of the data, potentially millions of lines where each transaction is a line, the team expects to provide the data in multiple sources, possibly one year at a time ([00:01:56](#00:01:56)). The plan is to initially provide all historical raw data and then follow up with only new transactions going forward. Davis Gallagher confirmed their team can easily handle joining the data ([00:02:48](#00:02:48)).

* **Demand Forecasting and Claims to PO Specifications**: Tim Dailey confirmed that the specifications for demand forecasting and the claims to purchase order (PO) use cases have been written by Amy and submitted ([00:03:38](#00:03:38)).

* **Status of Power BI Production Push**: Davis Gallagher and Tim Dailey discussed the delay in pushing the Power BI content into production, noting that the Power BI team has been slow; Tim Dailey plans to escalate the issue if it is not resolved by the end of the following week, as the request has been pending since December ([00:03:38](#00:03:38)).

* **Feedback on the Demo and Data App Access**: Davis Gallagher reported that they had not yet received specific feedback from Josh on the data application demo, as Josh is currently traveling. Tim Dailey mentioned that they work closely with Josh and know what they are looking for, but will book time with Josh the following day to review the application and provide joint feedback ([00:05:09](#00:05:09)) ([00:08:18](#00:08:18)). Davis Gallagher emphasized the importance of Josh interacting with the app to identify any potential bugs or display issues before integrating the live data connection ([00:05:49](#00:05:49)).

* **Mobile UI Strategy and Offline Access**: The team settled on an architecture where a single data application on the Rapid Canvas platform will be accessible via a mobile link, adapting its UI based on the device's screen resolution to show fewer elements on a mobile phone compared to a desktop ([00:05:49](#00:05:49)). The application is designed to allow offline access because all calculations are performed on the front end ([00:06:44](#00:06:44)). A user must log onto the platform while they have service to cache the UI and data on their device, and a sync status notification will alert them if a quote they generate while offline is being queued for push when connectivity is restored ([00:07:35](#00:07:35)).

* **Single Sign-On and Login Access**: Davis Gallagher asked about implementing single sign-on (SSO) for the application's deployment at scale, and Tim Dailey directed them to start by working with Glenn on this. The team plans to extend the login access token to require re-login only once a month to simplify the user experience ([00:08:18](#00:08:18)).

* **Success Criteria and UAT Timeline**: Davis Gallagher shared the scope and success criteria document for go-live, which includes functional, performance, and training criteria, and also outlines the User Acceptance Testing (UAT) plan ([00:09:04](#00:09:04)). Tim Dailey stated the document looked fine to them, but they need to show the success criteria to Josh for final approval, as they are the ultimate decision-maker for the tool. The plan targets having read access to AX data by April 27th to begin expanded UAT with a broader user audience ([00:10:48](#00:10:48)).

* **Need for Additional Parts Data Logs**: Davis Gallagher requested that Tim Dailey upload more months of parts data logs from AX to allow for more comprehensive testing of the similarity scoring, particularly for the low-confidence work order history fallback system ([00:11:27](#00:11:27)). Tim Dailey confirmed they had already asked their business analyst to upload the files and would follow up to ensure it is done ([00:12:18](#00:12:18)).

* **Summary of Next Steps**: The immediate next steps include adjusting the mobile UI for testing over the next two weeks, focusing on the AX integration, and Tim Dailey providing feedback from their review with Josh. Davis Gallagher committed to scheduling the meeting with Tim Dailey, Ray, Ray, and Glenn for the following week ([00:13:26](#00:13:26)).

### Suggested next steps

- [ ] Davis Gallagher will schedule a meeting with Tim Dailey, Glenn, Ray, and Ray next week to discuss the time frame and framework for getting information back to AX.

- [ ] Tim Dailey will wait until next Friday and then escalate the issue with the PowerBI team regarding Adam Chrismore at cat.

- [ ] Tim Dailey will book time with Josh tomorrow to review the demo feedback and the success criteria document, and then provide combined feedback to Davis Gallagher.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*Please provide feedback about using Gemini to take notes in a [short survey.](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=QTDFVzO8XozVJL7cbC-uDxIVOAIIigIgABgBCA&detailid=standard)*

# 📖 Transcript

Mar 25, 2026

##  MiltonCAT Services Automation Weekly Sync \- Transcript

### 00:00:00 {#00:00:00}

   
**Davis Gallagher:** Hey. Hey.  
**Tim Dailey:** Hey guys,  
**Davis Gallagher:** How's it going?  
**Tim Dailey:** good. How we doing?  
**Davis Gallagher:** Doing well. Doing well. Thank you. How's the week, Trina?  
**Tim Dailey:** It's a week. Every week's the same in ERP land.  
**Davis Gallagher:** Oh yeah, yeah, yeah. Just just another one down on the books.  
**Tim Dailey:** Yeah. just inching closer to go  
**Davis Gallagher:** What?  
**Tim Dailey:** live.  
**Davis Gallagher:** I I feel like I've asked this many times now, but what is tenative go live  
**Tim Dailey:** Uh this time next year we literally just hit within a year.  
**Davis Gallagher:** again?  
**Tim Dailey:** So it's middle of March of  
**Davis Gallagher:** Nice.  
**Tim Dailey:** 27\.  
**Davis Gallagher:** Nice. Okay. I feel like the last year is always the big uh the big push, too.  
**Tim Dailey:** Well, now it's real. Now it's like, oh, we have two Januaries from now, two March from now. It's like, oh, it's time ticks on.  
**Davis Gallagher:** Yeah. Yeah. Well, I hope it's going well and uh things are going  
   
 

### 00:01:06 {#00:01:06}

   
**Tim Dailey:** Yeah. Yeah. It's as smooth as something like that can go.  
**Davis Gallagher:** smooth.  
**Tim Dailey:** Yeah. I knew what I was signed up  
**Davis Gallagher:** Cool.  
**Tim Dailey:** for.  
**Davis Gallagher:** Um well, also thanks uh for for hop on that meeting on Thursday last week. I know it was uh you know kind of obviously it was a manual process to go through that but it was helpful for me to just see AX live and uh start to understand a little bit more.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** So that was a good frame of  
**Tim Dailey:** Yep. Yep,  
**Davis Gallagher:** reference.  
**Tim Dailey:** those specs are submitted. I talked to the developers yesterday and Glenn yesterday uh about getting those. So, I have asked Glenn to set up a meeting. If he hasn't reached out to you, you can reach out to him. But I talked to him yesterday about setting up me, you, him, Ray, and Ray about getting a time frame. What he wants to do is do a a push to you guys first, like kind of what we're doing for inventory, and do everything that way first.  
   
 

### 00:01:56 {#00:01:56}

   
**Tim Dailey:** And then he's got another project that he's working on that is taking precedent that is bringing information back to AX,  
**Davis Gallagher:** Yep.  
**Tim Dailey:** but he wants to use the same framework for you guys. It's gonna be through logic apps. Um a little over my head of how he's actually going to do it. That's why I want that meeting for a time frame and how we'll get the stuff coming back. So he knows I asked him to schedule it, but um you're you're better at getting that stuff scheduled than than we are. So if you want to just say, "Hey, you know, talk to Tim. What what works for um Ray Ray Glenn and  
**Davis Gallagher:** Yep.  
**Tim Dailey:** me.  
**Davis Gallagher:** Yeah, I can uh I'll shoot I'll shoot a note out.  
**Tim Dailey:** Okay.  
**Davis Gallagher:** Um I'll shoot for maybe next week for that meeting.  
**Tim Dailey:** Yep. Yep.  
**Davis Gallagher:** Cool.  
**Tim Dailey:** But the developers know what I'm looking for.  
**Davis Gallagher:** Cool.  
**Tim Dailey:** Um it's going to be a massive massive report. So what I think they're going to end up doing is giving you multiple data sources like a year at a time because it's just huge.  
   
 

### 00:02:48 {#00:02:48}

   
**Tim Dailey:** Each transaction's a line. Um, so I mean we're talk we're going to be in the millions of of  
**Davis Gallagher:** Yep. Yep.  
**Tim Dailey:** lines.  
**Davis Gallagher:** Yeah. I don't think it should be a problem either. It should be pretty easy for us to join all the data. As long as we we have it on hand,  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** we can we can handle that.  
**Tim Dailey:** Yeah. You guys will be much better at that piece than we are. So we're just going to give it to you the raw data and then um you know we'll do I think they're going to do the same approach where they're going to give you everything and then just give you new. So like they'll give you a historical everything back and then just give you new going forward.  
**Davis Gallagher:** Yeah, perfect. Um, and then before I get into the agenda that I got today, I wanted to ask about um because I imagine Glenn is going to want a similar uh spec for the demand forecasting and the um claims to PO use cases as well.  
   
 

### 00:03:38 {#00:03:38}

   
**Tim Dailey:** We Amy wrote that.  
**Davis Gallagher:** Is there Okay.  
**Tim Dailey:** Um Amy wrote it and that has been submitted  
**Davis Gallagher:** Awesome. Awesome.  
**Tim Dailey:** to claims the  
**Davis Gallagher:** Okay. Yeah. A mentioned that she did the claims to P1 today. I didn't know if we had one.  
**Tim Dailey:** PO. Yep.  
**Davis Gallagher:** Cool.  
**Tim Dailey:** Yep. Um,  
**Davis Gallagher:** Awesome.  
**Tim Dailey:** and then I poked Adam Davis, are you on those emails that for Adam Chrismore at cat still  
**Davis Gallagher:** I am on that. Yes. And I saw that um they haven't they're still waiting on the the PowerBI team to put it into go live,  
**Tim Dailey:** more the speed of  
**Davis Gallagher:** right? Put in production. That's what it was.  
**Tim Dailey:** smell over there. So, I'm going to give it to next Friday and then I'm going to go above them um to to push it because we've been asking since December. It's way too slow.  
**Davis Gallagher:** Yeah, that's how um that's how Delight used to work too.  
   
 

### 00:04:21

   
**Davis Gallagher:** I feel like it's how any big organization likes to work is they like to slow things down, take their time, and it's like, "Oh, well, let's just let's push this one back another week."  
**Tim Dailey:** They they just like to see if we really want it or not.  
**Davis Gallagher:** Yeah. Yeah. They're trying to see how important it is. Cool. Cool.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** All right. Um well well thanks for that and all the spec stuff. That's that's super helpful and um I think it'll be helpful for us especially as we start to you know um get the solution ready for go live. We talked I talked a little bit with Utum our team yesterday about some of the mobile UI considerations and I think we we've we're in good shape for that. But before getting into that wanted to to see if you had any feedback from I guess from your thoughts on the demo or if you heard any feedback from Josh. I sent him an email with an access to the data app and I added him I granted him uh user access to be able to play around with it.  
   
 

### 00:05:09 {#00:05:09}

   
**Davis Gallagher:** But I haven't heard anything back. So I don't know if you heard anything  
**Tim Dailey:** Yeah, I haven't. You know, he hasn't brought it up to me. He's traveling. I did talk to him today,  
**Davis Gallagher:** specific.  
**Tim Dailey:** but I didn't hear I could text him. I didn't hear anything from him. Like I know he's traveling.  
**Davis Gallagher:** Okay. Yeah, no worries. Um, I think we're and we're it seems like we're pretty he was generally aligned with how we're generating quotes too in terms of the the  
**Tim Dailey:** Yeah. Yeah. Me and Josh are very much lock step,  
**Davis Gallagher:** business.  
**Tim Dailey:** so I know what he's looking for. I used to work for Josh for like 15 years, so I know exactly what he's looking  
**Davis Gallagher:** Okay, perfect. Perfect. Yeah. Um,  
**Tim Dailey:** for.  
**Davis Gallagher:** but if he could, you know, at some point just get in there, play around, try to break it a little bit too, even though it's just a, you know, snapshot of the data.  
   
 

### 00:05:49 {#00:05:49}

   
**Davis Gallagher:** I think having those breaking points and having some, you know, if there's areas where we're having potential mismatches, not mismatches, but bug display issues or anything like that would be good to ameliorate, I guess, before we start getting the live data connection as well. Cool. Um, the only two the big things that I have because we're now that we've set everything up from a foundational  
**Tim Dailey:** So  
**Davis Gallagher:** perspective, the the two big things are the mobile app or the mobile UI, making sure that we're on the same page about how that works and then the kind of overall plan for what we've defined as success success criteria where we're going to start the broader user acceptance testing and when the go live is planned for.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** So, I'll start with the mobile stuff, the mobile app stuff. uh in talking to Utim who's our CTO um the the architecture that we were thinking for for mobile access is essentially that we'd have a the one data app on the Rapid Canvas platform so it' be a mobile link that users on desktop and mobile could both access um when you  
   
 

### 00:06:44 {#00:06:44}

   
**Tim Dailey:** Yep.  
**Davis Gallagher:** access it on mobile it would pick up the device that you're coming from or your screen resolution and manually adjust the UI. So if you're on phone it would obviously display a lot less elements. it would just be kind of the four filters to put in generating a quote versus if you're on desktop you have all the analytics on the right hand side. So the idea is to keep it in one data app that's just reflexive based on the user and where they're accessing from.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** And we can handle offline access because right now the way we have it designed is uh the  
**Tim Dailey:** Okay.  
**Davis Gallagher:** calculations are done on the front end of the app not on the back end. So you don't need to make a call to the back end to get results. Everything is hosted on the front end. Uh but what will have to occur from a user flow perspective is that a user will need to log on to the platform at some point before they go out in the field with service to just have the the UI cache on their phone essentially.  
   
 

### 00:07:35 {#00:07:35}

   
**Davis Gallagher:** So if you log into the website when you have service it'll cache and it'll store all the data on the front end in your browser uh on like Safari or whatever phone you're using for example. Um all the calculations occur on the front end so you don't need a back end.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** What we will also do is create a sync status essentially or sync message so that if they're out and they don't have service, there'll be kind of like a a tool tip or a notification says, "Hey, you don't have you're not syncing right now." So, if you're generating a quote, it's not being pushed, we'll put that into a queue on the front end that then gets pushed when they sync their devices back online. That's how I think we're thinking of the the user flow for that.  
**Tim Dailey:** Yep. Yep.  
**Davis Gallagher:** Does that make sense?  
**Tim Dailey:** That's that's how a lot of the apps they have work that they'll build it, wait till they get some connectivity, and then they it shoots it  
**Davis Gallagher:** Okay, perfect.  
   
 

### 00:08:18 {#00:08:18}

   
**Davis Gallagher:** Perfect.  
**Tim Dailey:** up.  
**Davis Gallagher:** And we'll we'll make sure to to try to reduce the number of login that we'll just extend the the login access token so that they only need to log in on the front end once a month usually before being reprompted for login. So that should should make it pretty easy, too. Um the the question that I have there is around single sign on access. I assume we're going to want to get single sign on for this as we deploy it at scale and same for the demand forecasting one.  
**Tim Dailey:** Yeah. Yeah.  
**Davis Gallagher:** um wanted to see who if you're the right person to work with or who the right person would  
**Tim Dailey:** Start with  
**Davis Gallagher:** Okay,  
**Tim Dailey:** Glenn.  
**Davis Gallagher:** got it.  
**Tim Dailey:** Josh's feedback said overall he likes it. Um he has some things he wants to review to with me and then we'll provide feedback together. So I'll book time with him tomorrow.  
**Davis Gallagher:** Okay.  
**Tim Dailey:** He's looking for time for me to do that tomorrow with  
   
 

### 00:09:04 {#00:09:04}

   
**Davis Gallagher:** Okay, perfect. That sounds great.  
**Tim Dailey:** him.  
**Davis Gallagher:** Yeah, if you want to send that over by email or we can just hop on the phone or if you want to cover it next week, that works for me, too.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Cool. Um, I think the only other thing that I wanted to run through given the chance we didn't given that we didn't get a chance to do it last week was the kind of timeline for for go live and for testing. Um, I know I initially when I put things together talked about like a phased testing approach where we have phase one of testing with our historical snapshot and then phase two of testing would be with further integration. I think we ended up agreeing that we're instead just going to do like a very limited round of testing before we have AX integration. Um, so I'll adjust that, but wanted to just flash this document up real quick.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** And maybe even before I show that, see, have you had a chance to look at this yet?  
   
 

### 00:09:56

   
**Tim Dailey:** That's what you sent me two Fridays ago, correct?  
**Davis Gallagher:** Correct.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** Yeah.  
**Tim Dailey:** I've I've skimmed through  
**Davis Gallagher:** Okay. Yeah. any any quick thoughts? I don't want to go through it necessarily in further detail,  
**Tim Dailey:** this.  
**Davis Gallagher:** but essentially, you know, it's it's a a compilation of what our scope is, what the functional criteria is from the application perspective, so what it should be able to do every time you access it and what this what those success criterias are for go live uh performance criteria. So it's basically availability, speed of the app that it can load and uh work under certain operating conditions and then that we give you the correct training and that there's trust in the model and the quotes generating and then you know the big  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** piece is around UAT testing where I was hoping that you know and Josh is already starting this but we can use you know the next week or two to essentially get feedback on this historical snapshot and this week we're going to work on that mobile UI.  
   
 

### 00:10:48 {#00:10:48}

   
**Davis Gallagher:** So we can use the next week or two for thoughts on the mobile UI if you're accessing it on your phone just to see what it's working like and how it's operating. And then once we get to AX integration that's my target was hopefully by April 27th we'll have at least read access. Um and then we can start the expanded UAT with a with a broader user audience. But um I don't know if that that time makes sense to you if you want to push it back  
**Tim Dailey:** nothing nothing stood out.  
**Davis Gallagher:** forward.  
**Tim Dailey:** I wanted to go over the success criteria with Josh because he's going to be the one who's going to yay or nay that. It it looked fine to me when I saw it. Like I didn't see anything when I read this, David. Nothing nothing was a red flag to me when I when I went through it.  
**Davis Gallagher:** Okay,  
**Tim Dailey:** But I do want to show this to Josh because he he's you know it's it's his it's going to be his tool and he's he's ultimately paying for  
   
 

### 00:11:27 {#00:11:27}

   
**Davis Gallagher:** perfect.  
**Tim Dailey:** it.  
**Davis Gallagher:** Yep. Yeah, makes sense. Would it be helpful for me to include Josh on these calls moving forward too? I know he's I'm sure he's pretty busy,  
**Tim Dailey:** No,  
**Davis Gallagher:** but Okay,  
**Tim Dailey:** he doesn't have time.  
**Davis Gallagher:** got it.  
**Tim Dailey:** We can I can if we need him for certain things like let me know. I can I can see if I can team him up. But um I can handle most of it up until basically sign off or some of that feedback.  
**Davis Gallagher:** Okay, cool. Um, perfect. The only other thing that I wanted to flag was I know it's a major pain in the ass to generate uh those parts data logs from AX, but if if if it's possible or if you'd be able to upload maybe at least a couple more months just so that we can test the similarity scoring out a bit more for more recent work orders. And you know,  
**Tim Dailey:** Did I not give you more?  
**Davis Gallagher:** I'm not sure if I saw it.  
   
 

### 00:12:18 {#00:12:18}

   
**Davis Gallagher:** Let me double check.  
**Tim Dailey:** I had I gave I gave my business analyst the link and told her to put them up there. I thought she did it. Let me see.  
**Davis Gallagher:** Let me double check right now. No, I do not have more files in there  
**Tim Dailey:** I'll ask her right  
**Davis Gallagher:** yet.  
**Tim Dailey:** now. Okay. I just asked her if she did it. She might have done it, not uploaded it, but I asked her to do it already.  
**Davis Gallagher:** Okay, perfect. Thank you. Yeah, that that'll be good just to especially when we get to the using the what what what we  
**Tim Dailey:** So,  
**Davis Gallagher:** call the tier three fallback where we have really low confidence work order history and we want to use similar quotes based on parts overlap, parts quantity and labor overlap to at least inform what the quote generation or what the generated quote should be what we have for work order history. I think that'd be really helpful to  
**Tim Dailey:** Yeah.  
   
 

### 00:13:26 {#00:13:26}

   
**Davis Gallagher:** test.  
**Tim Dailey:** Yeah, for sure. Yeah, I agree with  
**Davis Gallagher:** Perfect.  
**Tim Dailey:** that.  
**Davis Gallagher:** Cool. Uh, honestly, that that's kind of the the main agenda items I have today. The the next steps for us are to make those mobile UI adjustments that you can test it out over the course of this and next week, you and Josh. Um, and then obviously the AX integration is going to be the the main next step. Um, but we wanted to see if there were any other, I guess, top of- mind things for your from your perspective, whether it's from the UX or whether it's more broadly. Um, because that was that was kind of my list.  
**Tim Dailey:** Yeah. No, that's I had the same panelist. This is really just the tools looking good. I I got that time booked with Josh for tomorrow, so we'll get some feedback for you at that point. Um, and I got with Glenn yesterday to try to push that along.  
**Davis Gallagher:** Okay, perfect.  
**Tim Dailey:** So,  
**Davis Gallagher:** Then I'll um I'll set up time with you, Ray, you, Ray, Ray, Glenn, and I uh next week.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** And uh I'll like I said, feel free to just shoot me an email with that feedback so we can start working on it. Awesome.  
   
 

### Transcription ended after 00:14:49

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*