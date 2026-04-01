# 📝 Notes

Apr 1, 2026

##  MiltonCAT Services Automation Weekly Sync

Invited [Lucas Inacio Luz](mailto:lucas.inacio@rapidcanvas.ai) [Fuge Zou](mailto:fuge@rapidcanvas.ai) [Ray Hsu](mailto:ray@rapidcanvas.ai) [Davis Gallagher](mailto:davis@rapidcanvas.ai) [Herbert Gomes Miranda](mailto:herbert@rapidcanvas.ai) [tim\_dailey@miltoncat.com](mailto:tim_dailey@miltoncat.com) [patrick\_bendiak@miltoncat.com](mailto:patrick_bendiak@miltoncat.com)

Attachments [ MiltonCAT Services Automation Weekly Sync](https://www.google.com/calendar/event?eid=NGhnbDRtcWRxYWk0NDRyNzFnM2ZscGRkNHBfMjAyNjA0MDFUMTgwMDAwWiBkYXZpc0ByYXBpZGNhbnZhcy5haQ) 

Meeting records [Transcript](?tab=t.sqgwfudgw3ft) 

### Summary

Data set creation error surfaced, similarity scoring logic was deemed unsuitable for business use, and required UI updates were discussed.

**Data Set Creation Issue**  
An issue was noted where platform errors during data set creation prevent users from changing the separator and rerunning the process. The platform incorrectly indicates the data set already exists after the initial failure.

**Similarity Logic Overhaul**  
The current similarity scoring logic, based purely on labor cost, was deemed unsuitable for business use and required replacement with a 4-dimensional approach including parts overlap and quantity. The current similarity scoring feature was decided to be removed from the frontend to prevent users from seeing inaccurate information.

**Multiple Quotes Feature**  
It was agreed that the user interface must be updated to allow multiple job components to be added to a single quote before the final push to AX. Quote turnaround time is projected to significantly drop from 1.8 days to a few minutes, demonstrating substantial business value.

### Details

* **Platform Data Set Creation Issue**: Herbert Gomes Miranda noted an issue with the platform automatically attempting to create a data set using a comma as a separator when connecting to the S3 bucket. If this initial attempt fails, and users try to change the separator and rerun the process, the platform indicates that the data set already exists, preventing them from changing the separator. Davis Gallagher acknowledged the issue, understanding that because the first attempt fails, users cannot rerun the process since a data set with the same name already exists ([00:00:00](#00:00:00)).

* **Similarity Scoring Logic Review**: Davis Gallagher and Tim Dailey discussed the current similarity scoring logic and its unsuitability for business use, as it was incorrectly suggesting similar items, such as generators, for a specific wheel loader model (980) ([00:08:31](#00:08:31)). The current system computes similarity purely based on labor cost average and labor cost variance, which is not how it would work in practice ([00:09:33](#00:09:33)). Tim Dailey suggested that similarity scoring should potentially focus on the three-digit prefix of the model number (e.g., 980\) rather than connecting completely different model numbers ([00:08:31](#00:08:31)).

* **Proposed Similarity Scoring Dimensions**: Davis Gallagher explained the planned four-dimensional approach for computing similarity, which would involve parts overlap, parts quantity, and two components related to labor ([00:10:25](#00:10:25)). Tim Dailey confirmed that the assumption that different models (like a 255 and a 980G) would not share the same parts and quantity is correct. It was noted that while different models (e.g., 905 and 980\) might share engine parts, the difference in labor costs for removal and installation (RNI) due to varying complexity should factor into the similarity score ([00:11:17](#00:11:17)) ([00:12:57](#00:12:57)).

* **Similarity Scoring Frontend Removal**: Due to insufficient data and the potential for the current flawed similarity scoring to confuse users, Lucas Inacio Luz and Herbert Gomes Miranda were instructed by Davis Gallagher to remove the similarity scoring feature from the frontend temporarily. The removal is intended to prevent users from seeing inaccurate information until more data is available and the logic can be fully tested ([00:12:57](#00:12:57)).

* **Implementing Multiple Quotes per Job**: The team discussed the need to allow multiple job components to be added to a single quote, which is a project requirement. Davis Gallagher and Tim Dailey agreed that the user interface should be updated to replace the "push to AX" button with an "add to quote" feature, allowing multiple items to be compiled into a generated service quote before the final push to AX ([00:13:52](#00:13:52)). Tim Dailey clarified that the machine and prefix information at the top should remain constant, but the job component codes would change for each segment added to the quote ([00:14:49](#00:14:49)).

* **Visualizing Work Order History and Range of Hours**: Tim Dailey provided feedback on visualizing work order history, specifically suggesting improvements for how the range of hours and parts pricing are displayed when multiple work orders exist. The visualization should use a bar chart format (similar to a Pareto chart) to show how many work orders fall into specific buckets across the range of hours and parts pricing, helping users identify potential outliers and understand the data distribution ([00:15:41](#00:15:41)) ([00:18:16](#00:18:16)).

* **Mobile UI Updates and Sync Functionality**: Davis Gallagher reported progress on mobile UI updates, stating that the current mobile versus desktop switch will be removed, and the display will adjust based on the user's access resolution. They also noted that a sample version of the sync functionality will be introduced, but full implementation will wait until the AX pipeline is operational, as the current data is static. Tim Dailey confirmed that the parts list necessary for the parts data is complete, pending validation ([00:20:01](#00:20:01)).

* **Agenda for Meeting with Doug**: Davis Gallagher outlined the agenda for the upcoming 45-minute meeting with Doug, which will consist of 15-minute segments focusing on updates/progress on use cases, an update on AX integration, and a discussion of Amy's automation ideas ([00:21:35](#00:21:35)). Tim Dailey agreed with the agenda and planned to provide Davis Gallagher with their project recommendations to potentially include in the presentation deck ([00:22:27](#00:22:27)).

* **Business Value and Impact Metrics**: The team discussed key metrics for measuring business value, which Tim Dailey identified as headcount and turnaround time ([00:23:10](#00:23:10)). Tim Dailey noted that the project is expected to significantly reduce quote turnaround time from the current 1.8 days to a few minutes, which provides business value even without the full AX integration ([00:24:04](#00:24:04)).

* **GCSS Data Access and Next Steps**: The conversation regarding GCSS data access was viewed positively, with the expectation of getting access relatively soon. It was agreed that the GCSS data acquisition and the resulting sales quoting process would be a key topic for the last 15 minutes of the Friday meeting, including how the tool can help generate sales quotes and find correct programs for sign-up ([00:24:54](#00:24:54)).

### Suggested next steps

- [ ] \[Lucas Inacio Luz\] Remove Scoring: Remove similarity scoring feature from the front end due to insufficient data.

- [ ] \[Tim Dailey\] Share Roadmap: Send project chart roadmap copy to Davis Gallagher. Ensure inclusion as high-level view in the deck.

- [ ] \[Tim Dailey\] Provide Feedback: Make comment regarding GCSS data timeline speed once data is received.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*Please provide feedback about using Gemini to take notes in a [short survey.](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=S4TXmjqIaGC7GSoMFDosDxIVOAIIigIgABgBCA&detailid=standard)*

# 📖 Transcript

Apr 1, 2026

##  MiltonCAT Services Automation Weekly Sync \- Transcript

### 00:00:00 {#00:00:00}

   
**Lucas Inacio Luz:** Hey, there's  
**Davis Gallagher:** Hey, Lucas.  
**Lucas Inacio Luz:** I'm I need to  
**Davis Gallagher:** How's it going? Doing well. Doing well. Appreciate that. I'm so confused.  
**Herbert Gomes Miranda:** I'm trying to have access to the S3 bucket locally to check the file platform  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** because the platform when you uh connect to  
**Davis Gallagher:** No.  
**Herbert Gomes Miranda:** the S3 bucket to create a data set the platform firm automatically tries to create a data set using the comma as separator and I believe that's a problem because if that fails and you try to change the separator and run again the platform says that that that data set already exists.  
**Davis Gallagher:** Oh.  
**Herbert Gomes Miranda:** So basically you cannot change the separator that's that's what's  
**Davis Gallagher:** Oh, interesting. So,  
**Herbert Gomes Miranda:** happening.  
**Davis Gallagher:** because the the one fails, you can't rerun it because there's already one the same  
**Herbert Gomes Miranda:** Yeah. Yeah. And it's automatically you can you cannot choose the first the first try to  
   
 

### 00:02:06

   
**Davis Gallagher:** name.  
**Herbert Gomes Miranda:** be column for example you can you cannot choose I I think  
**Davis Gallagher:** That's okay. Good call.  
**Herbert Gomes Miranda:** that's the problem I think that's the  
**Davis Gallagher:** All right. Well, that's uh we'll it's all right.  
**Herbert Gomes Miranda:** problem  
**Davis Gallagher:** I mean, that happens. It's you know, we'll figure it out. We'll go from there.  
**Herbert Gomes Miranda:** I'm checking  
**Davis Gallagher:** I see Tim is in the waiting room. So, I'm let him  
**Herbert Gomes Miranda:** Okay.  
**Davis Gallagher:** in. Hey, good afternoon, Tim.  
**Tim Dailey:** Hey guys,  
**Herbert Gomes Miranda:** Hi  
**Lucas Inacio Luz:** Hey.  
**Tim Dailey:** I fored to Bendiac,  
**Herbert Gomes Miranda:** Jim.  
**Tim Dailey:** but uh I believe he I fored like last minute, so I don't know if you'll be able to come  
**Davis Gallagher:** Okay. Yeah,  
**Tim Dailey:** on.  
**Davis Gallagher:** I saw he it looked like I got a message that he accepted. So,  
**Tim Dailey:** Oh,  
**Davis Gallagher:** we'll get him  
**Tim Dailey:** okay. Give him a second.  
**Davis Gallagher:** on.  
**Tim Dailey:** I did text him, but he might have just been um accepting the  
   
 

### 00:03:03

   
**Davis Gallagher:** Okay.  
**Tim Dailey:** series.  
**Davis Gallagher:** Okay. Do you want me to just add him directly to the series that he gets the directly from  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** me?  
**Tim Dailey:** that would be  
**Davis Gallagher:** Cool.  
**Tim Dailey:** good.  
**Davis Gallagher:** Let me do that right now. How's the week  
**Tim Dailey:** Uh I don't even know what day of the week it is.  
**Davis Gallagher:** content?  
**Tim Dailey:** If you told me today was Friday, great. If you told me it was Monday, sure.  
**Davis Gallagher:** Well, the good thing is we're we're almost at Friday. I guess technically we're we're I guess right now is officially like halfway through or a little more than halfway  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** through.  
**Tim Dailey:** Like to hear  
**Davis Gallagher:** So, we're we're moving up.  
**Tim Dailey:** that.  
**Davis Gallagher:** Moving up. I was talking with uh with Ray before about uh this past weekend. He's a big Yukon guy. I don't know if you saw the game on  
**Tim Dailey:** Oh, yeah. I've already I made sure Ray was okay.  
   
 

### 00:03:46

   
**Davis Gallagher:** Sunday.  
**Tim Dailey:** He's a huge hu He travels to the Yukon game. So that must have been huge for  
**Davis Gallagher:** Yeah. Yeah.  
**Tim Dailey:** him.  
**Davis Gallagher:** I mean, if he didn't have a heart attack, which thankfully we met with him earlier today,  
**Tim Dailey:** That's what I was checking on.  
**Davis Gallagher:** he was okay.  
**Tim Dailey:** I was like, are you  
**Davis Gallagher:** That was crazy.  
**Tim Dailey:** okay?  
**Davis Gallagher:** Wow. Yeah, it was a good weekend. Good weekend. My bracket's not uh in great shape right now. I'm in like 50th percentile on ESPN tournament challenge,  
**Tim Dailey:** You know what? I didn't even do one this year.  
**Davis Gallagher:** but  
**Tim Dailey:** It's usually just I usually do a donation and lose. So I was like, you know what? I'm not doing it.  
**Davis Gallagher:** yeah, probably for the better financially.  
**Tim Dailey:** Stick to fantasy football. That's great. That's  
**Davis Gallagher:** Yeah,  
**Tim Dailey:** it.  
**Davis Gallagher:** I I've been trying to get I've always had I've been I've been doing fantasy for like 15 years, fantasy football, um since I was younger.  
   
 

### 00:04:35

   
**Davis Gallagher:** And this year I uh I tried to craft a strategy for you know I won I won three championships this year so it worked out.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** But in the season I was trying to craft a strategy to create like funny enough same game parlays of course on some guys.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** So I subscribed to not PFF but another like analytics tool and was creating my like  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** custom models. Let's just say I hit on like maybe one of 15 same game products.  
**Tim Dailey:** We have a guy here, one of our data guys who uses his his knowledge for evil as well. And he puts all these bets together and all these odds and stuff like that. He's always telling me and then I was like, "Well, how do you do?" He goes, "Not great." I'm like, "Well, then why are you doing all the work? You can suck benton just with what you think.  
**Davis Gallagher:** It's the funny thing is like yeah my my crapshoot like gut feel is basically the same as these like the same plus minus as these crazy models I'm building.  
   
 

### 00:05:28

   
**Tim Dailey:** You can't beat them.  
**Davis Gallagher:** So it now no now I guess it is fun to do sometimes like I feel like  
**Tim Dailey:** You can't beat them. Yeah.  
**Davis Gallagher:** I'm sophisticated and then I realize I'm not  
**Tim Dailey:** Well, they I don't know what you use,  
**Davis Gallagher:** and  
**Tim Dailey:** but I was using DraftKings for a little bit and they did the ghost par ghost leg parlay, which was great, but they did it very briefly because I think they lost a ton of money because you'd get that ghost leg and you would you would throw a  
**Davis Gallagher:** yeah  
**Tim Dailey:** crazy one out there and you would, you know, win or not, but you would get your money back. So they I don't see that promo too often. So I think that didn't go great for  
**Davis Gallagher:** no they did it like for uh a few weeks in the middle of the season and then they they have it now  
**Tim Dailey:** them.  
**Davis Gallagher:** for some basketball parlays still I've noticed um at least on my account. So maybe maybe it's because I'm net in the red.  
   
 

### 00:06:10

   
**Tim Dailey:** I'm really good at I'm a big Celtic fan obviously being in Boston. I love the Celtics. I've I've watched my whole life and I just got a good flow for the team. My the thing I make all my money on is next basket three. I can kind of get a feel. You can kind of see the lineup. I'm like, "Oh, these guys are they're just going to chuck it." They make all and they give you great odds.  
**Davis Gallagher:** I love that.  
**Tim Dailey:** Great  
**Davis Gallagher:** Yeah. Yeah. I was last, this is,  
**Tim Dailey:** odds.  
**Davis Gallagher:** I guess, a couple years ago now, but I noticed that FanDuel specifically, had the most mispriced odds for live points, rebounds, and assists. And I remember there were two times,  
**Tim Dailey:** Yes.  
**Davis Gallagher:** two specific instances where I had uh Jimmy Butler, I think points, rebounds, assists, and who was the guy on the heat that like was the another bench guy who came in, I forget his name, but his overunder on points was like I think 11 points or was 10 plus at like plus 500\. He had seven points with 11 minutes to go in the third quarter and he was plus 500 to score over 10\.  
   
 

### 00:06:59

   
**Tim Dailey:** Yeah.  
**Davis Gallagher:** I was like, what are we doing here? So I I hit that one and then had another one with Jokic. He had 15, 10, and five at the half. And for him to get 30, 10, and 10 was like plus 600\. And I was like, what? How is that?  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** That's a horrible price. But I have not seen them be as good lately,  
**Tim Dailey:** I find DraftKings to have the best odds in your favor on futures.  
**Davis Gallagher:** unfortunately.  
**Tim Dailey:** I make a lot of money on the futures. Celtic futures, Patri Futures, like they always undervalue undervalue big time. They have the Celtics at 41 and a half wins. They have 52 with 10 games left. So, I I teased that up. I was like, there's no way this team is that bad.  
**Davis Gallagher:** Yeah. Yeah. Well, I guess the the price was like, "Oh, there's no Tatum." But Jaylen Brown and the rest of that team is is pretty  
   
 

### 00:07:50

   
**Tim Dailey:** I don't know what they were looking at because even without Tatum,  
**Davis Gallagher:** good.  
**Tim Dailey:** it's still a top five team in the East. The East sucks.  
**Davis Gallagher:** Yeah. Yeah. And Missoula is a great coach.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** I'm a big Mula fan.  
**Tim Dailey:** All right. Now the fun stuff's out of the way.  
**Davis Gallagher:** Yeah.  
**Tim Dailey:** What are we looking at today?  
**Davis Gallagher:** Yeah. Um, I wanted to, well, I assume I guess I forward it over to Pat. Um, we'll get started. Hopefully, he'll he'll join on, but I wanted to talk a little bit about the feedback that we got from them because I know you had some a few lines that we sent over by email. So,  
**Tim Dailey:** Yep.  
**Davis Gallagher:** I wanted to see if you had a little more context to that that I could just take back. And then I also wanted to talk about um the similarity scoring and like some of the  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** maybe uh visual things that show distortion or the way that it's actually being  
   
 

### 00:08:31 {#00:08:31}

   
**Tim Dailey:** Yeah.  
**Davis Gallagher:** calculated to make sure that what we're doing is the right thing that we if we do need to pivot adjust that logic to be to be correct.  
**Tim Dailey:** 100 100%.  
**Davis Gallagher:** That's my  
**Tim Dailey:** So on the similarity,  
**Davis Gallagher:** hope.  
**Tim Dailey:** my feedback is there is that we just have a hard time as a business thinking how you would connect them. So if you do like a 980, maybe you could do similarity scoring between a 980G and a 980M and a 980 K, but you couldn't do a 980 and a 972\.  
**Davis Gallagher:** Yeah.  
**Tim Dailey:** You can't do a 980 and a 990\. It would have to be the three-digit prefix and then you can do similarities post  
**Davis Gallagher:** Heat.  
**Tim Dailey:** that and even those weak question but we'd like to see what you come up with but trying to like when we looked at the similarities it was like not even close you show  
**Davis Gallagher:** Yeah. Yeah.  
**Tim Dailey:** the similarities had we were looking at a 980 and it was giving us generators for similar and it probably looked on like job component and hours wise but that's you know looking at a wheel loader and looking at something completely different.  
   
 

### 00:09:33 {#00:09:33}

   
**Tim Dailey:** So these are not created equal. But you might be able to do the the model without the letter  
**Davis Gallagher:** Yeah. Yeah.  
**Tim Dailey:** denotation.  
**Davis Gallagher:** Yeah. So on that one, I think the reason that it's showing up weird right now or wonky is because it's computing similarity score purely off of labor cost average and labor cost variance. So if labor costs are similar, it's going to flag,  
**Tim Dailey:** Right.  
**Davis Gallagher:** which would not be how it works in practice. like we only have the parts data for October, November and December.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** There's a very limited window of actual real similarity scores that we can create. And the way that a simil so like overall business logic right for the quote generation is standard job is  
**Tim Dailey:** Yep.  
**Davis Gallagher:** standard job. Obviously tier two is work order history and it it's basically is the work order history solid. Do we have a decent work order history? We're going to use that. Tier three is the similarity scoring.  
   
 

### 00:10:25 {#00:10:25}

   
**Davis Gallagher:** only kicking in when we are generating a quote on work order history that has lower than 30% confidence. So basically the only time that will happen is if we have like let's say two or three work orders and they vary across parts, labor and miscellaneous costs wildly. So it's it's probably an edge case more generally that'll ever be used because I don't imagine that will happen a lot.  
**Tim Dailey:** Okay.  
**Davis Gallagher:** But if it does, the way that we're computing similarity is in four dimensions. The first is uh parts overlap. So do they share the same parts?  
**Tim Dailey:** That's what I was going to ask  
**Davis Gallagher:** Then parts parts quantity is the second piece.  
**Tim Dailey:** you.  
**Davis Gallagher:** So if they use the same parts, do they have the same quantity? And then labor is the third and fourth component to it.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** So my assumption was basically that we would never have a scenario where a 255 and a 980G use the same parts in the same quantity. But is that a correct assumption or is that fundamentally  
   
 

### 00:11:17 {#00:11:17}

   
**Tim Dailey:** That's a correct assumption.  
**Davis Gallagher:** incorrect?  
**Tim Dailey:** So you say when when the parts get in there, it will naturally do what I'm saying.  
**Davis Gallagher:** Exactly. Exactly.  
**Tim Dailey:** Okay.  
**Davis Gallagher:** We won't have to  
**Tim Dailey:** Because you might have,  
**Davis Gallagher:** filter  
**Tim Dailey:** and this is where I'm a little concerned, but between like a 930, call it a 9, whatever, a 905 to a 980, you could have similar parts because that CAT puts the same engine in multiple models. So like if you're doing engine work, you could have that, but that you know, let's say you do an RNI an RNI engine to take it out of one machine model is different, harder, longer than taking it out of another one. So if you want to keep going down your path of looking at it and you get more parts and see if it shakes out, I'm fine. But just from a business side, we know that's not right. So,  
**Davis Gallagher:** Yeah.  
**Tim Dailey:** so once we look at it, if it's still putting up these false flags, we would take it out because as an enduser, we are we're in the Northeast.  
   
 

### 00:12:15

   
**Tim Dailey:** Very cynical PE user base. So, if they if they, you know, pops up and says that's a 980, that's a generator. Say, they're going to say this whole tool doesn't know what it's doing.  
**Davis Gallagher:** Yeah, 100%.  
**Tim Dailey:** That's just I worked with this user base a lot. So,  
**Davis Gallagher:** 100%.  
**Tim Dailey:** I just don't want to put anything that gives them a a pause.  
**Davis Gallagher:** Yeah. Yeah.  
**Tim Dailey:** Which is why I gave Ray s\*\*\* about his demo of trying to put undercarriage on a loader.  
**Davis Gallagher:** That's  
**Tim Dailey:** They they ate that alive when I showed everyone that. And I said I paused. I go, "You're going to see something. This is test data." And they still were like they still came up with a thing that put an undercarriage on a wheel load. I'm like, "I know. I know.  
**Davis Gallagher:** say that was probably a running gag for like a month afterwards,  
**Tim Dailey:** I still hear it.  
**Davis Gallagher:** wasn't it?  
**Tim Dailey:** I still hear it.  
**Davis Gallagher:** That's hilarious.  
   
 

### 00:12:57 {#00:12:57}

   
**Davis Gallagher:** Yeah. I guess uh digging deeper into that question where like the 905 and 980 will have shared components for the engine. In that case, if we assume that the job is fundamentally different, would there be a variation in the labor and miscellaneous cost then? because you know one like the 980 I'm just assuming like the 980 is a more complex  
**Tim Dailey:** should be.  
**Davis Gallagher:** remove and install versus a 905 even it use the same parts therefore we see that the 980 has much higher average labor costs so that'll be part of the similarities score because labor is is in there as well would  
**Tim Dailey:** Okay.  
**Davis Gallagher:** that account for it or is there still like in those differences it wouldn't necessarily show labor  
**Tim Dailey:** No, that should I'm keep it the way it is. Let's get your parts in there.  
**Davis Gallagher:** cost okay sweet yeah and I think uh to  
**Tim Dailey:** Let's see how it reacts.  
**Davis Gallagher:** your point like Lucas and Herbert, let's just remove the similarity scoring from the front end right now because we don't have enough data and it's just going to freak people out when they see something that that shows up like that.  
   
 

### 00:13:52 {#00:13:52}

   
**Lucas Inacio Luz:** Okay, I'll do that.  
**Tim Dailey:** Um the other one of putting the multiple quotes on there. So something I talked to Ray about and you pine about and I don't think you were on the project yet Davis. So that's a requirement we have. So it could be that you do you know you do a job component quote for remove engine quote it whatever that is and then on the same quote you want install engine or these big longer complex  
**Davis Gallagher:** Yep. Yep. Yeah, that that makes sense to me.  
**Tim Dailey:** jobs.  
**Davis Gallagher:** When it comes to like I guess the the workflow of it, would it be like you know I guess I'm thinking because right now I'm just going to pull up the the solution for frame reference.  
**Tim Dailey:** Yeah, I had an idea because I was thinking of it too.  
**Davis Gallagher:** Okay, cool.  
**Tim Dailey:** Basically like add another segment  
**Davis Gallagher:** Exactly. Yeah. Like I'll just do uh 255\.  
**Tim Dailey:** button.  
**Davis Gallagher:** Where is it? 255 DY7 install software.  
   
 

### 00:14:49 {#00:14:49}

   
**Davis Gallagher:** Like so if we were to do this right now, we just have as a static push to ax as one line item. Should this line instead be add to quote and then above this generated  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** service quote filter, it shows you what you've added to the quote.  
**Tim Dailey:** you got it.  
**Davis Gallagher:** And that through that tool tip you would push to  
**Tim Dailey:** You got it. And when you add the quote,  
**Davis Gallagher:** AX.  
**Tim Dailey:** your stuff up top should stay because you're still going to do the 255, the DY7. You just got to change the job component codes.  
**Davis Gallagher:** Yep. Yep. So add Yep. Cool.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** Okay. Sweet.  
**Tim Dailey:** Okay.  
**Davis Gallagher:** I think that's super clear.  
**Tim Dailey:** Okay. And we can talk about the other one if you want to bring that tool back up.  
**Davis Gallagher:** Yep. Yeah.  
**Tim Dailey:** Uh, yeah. So, just generate a generate a quote that won't have a standard job if you have a tested one used.  
   
 

### 00:15:41 {#00:15:41}

   
**Tim Dailey:** I could probably give you one. Yeah, that won't have a standard job. I don't know what the hell that is. Um, so that so once you've hit that piece, those uh on the right should go away and it should be go. Let's go down. Okay, there's only one work order. Um,  
**Davis Gallagher:** save for  
**Tim Dailey:** what if there's multiple work orders?  
**Davis Gallagher:** God.  
**Tim Dailey:** I uh it would say like one of let's say the yellow box is parts and the blue one is labor hours.  
**Davis Gallagher:** Yeah.  
**Tim Dailey:** The line would then be the the different work orders and it would go high to low or kind of like a grouping of how many fall within those um those buckets. Does that make sense? So, like hour-wise, let's say your range for hours, keep another one that has multiple. Do um do a 980k. Uh yeah, do a a prefix and then Okay. W um do troubleshoot and then actually just for the sake of it, do travel to and from Um,  
   
 

### 00:16:54

   
**Davis Gallagher:** Yeah.  
**Tim Dailey:** so your job code's going to be um I think it's 030 travel.  
**Davis Gallagher:** actually not seeing that show up as a job code for this combo. Interesting.  
**Tim Dailey:** What's uh what's the job code list? I can't see because you only have the the  
**Davis Gallagher:** Oh yeah. Yeah. Let me let me share my full screen  
**Tim Dailey:** screen.  
**Davis Gallagher:** here. Here we go.  
**Tim Dailey:** Okay. Um, I think it's 030\. Uh, oh, go up one. Travel to and from. It's the second one there, I think. So, that one say travel. The screen's a little um distorted.  
**Davis Gallagher:** How about now? Is that  
**Tim Dailey:** Uh much better.  
**Davis Gallagher:** better?  
**Tim Dailey:** Uh remove go down.  
**Davis Gallagher:** There it is. 056\.  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** That's why field service.  
**Tim Dailey:** Uh machine would be the better one.  
**Davis Gallagher:** Okay.  
**Tim Dailey:** Just because I know there's going to be multiples and there's not going to be a standard job on this one.  
   
 

### 00:18:16 {#00:18:16}

   
**Davis Gallagher:** Yeah.  
**Tim Dailey:** Perfect. So, can you just go a little bit bigger because it's still a little jumbled here for me. Perfect.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** Uh, okay. Okay. See how your range of hours is 0 to 24\. So, on your labors,  
**Davis Gallagher:** Yep.  
**Tim Dailey:** you would have a bar for 0 0 1 2 3 whatever you actually had for hours.  
**Davis Gallagher:** Mhm.  
**Tim Dailey:** And then it would be a longer bar for the more work orders that fell in those buckets.  
**Davis Gallagher:** All  
**Tim Dailey:** So your range is zero for 24, but is do you have one zero and the rest are at  
**Davis Gallagher:** right.  
**Tim Dailey:** 24? You know what I'm saying?  
**Davis Gallagher:** Yep.  
**Tim Dailey:** And same thing for parts pricing. You know, start with your high, your lowest and your highest. Have a bar for each parts pricing you have and then show kind of the the flow of that.  
**Davis Gallagher:** Got it. Got it. So it's it's kind of like a paro chart which is you know we have x amount of work  
   
 

### 00:19:08

   
**Tim Dailey:** Yes.  
**Davis Gallagher:** orders. The labor is across this range. It shows up in this part of the range x times this part of the range y times.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Same thing for parts.  
**Tim Dailey:** Yep. Because we want to know, okay, there's your there's your average, but you know,  
**Davis Gallagher:** Got  
**Tim Dailey:** how many fall? Like, do you have them all 24? You have one in 24\. Is that an outlier, not an outlier? It helps the guys with that because again, trying to find any ways that they can't pick it apart or if they can pick it apart, they can digest it in their own brain.  
**Davis Gallagher:** Yep. Yep. Okay, perfect. Yeah, that 100% makes sense. Cool. Um, I think those are the the big questions that I wanted to run through, Tim. And then just to flag, we are still in progress on the mobile UI updates. I know right now on the top like there's a mobile versus desktop switch.  
   
 

### 00:20:01 {#00:20:01}

   
**Tim Dailey:** Yep.  
**Davis Gallagher:** We're we're going to remove that entirely. It's just going to be,  
**Tim Dailey:** Okay.  
**Davis Gallagher:** you know, based on where the user is accessing from. Whether it's mobile with X screen resolution or desktop with X screen resolution,  
**Tim Dailey:** Yep.  
**Davis Gallagher:** they'll have two different modals that display um and adjust the resolution.  
**Tim Dailey:** Okay. Good. Good.  
**Davis Gallagher:** And then also working on that the sync functionality. I think we'll probably we'll probably introduce like a sample version of the sync functionality, but really not actually implement it until we have the AX pipeline going because it's all right now static data.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** So there's no like real actual sync functionality to to create.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Um but that's that's on the road map as  
**Tim Dailey:** Your parts list to give you the parts data is done.  
**Davis Gallagher:** well.  
**Tim Dailey:** I'm just validating right now. Uh I just needed a minute to validate that. But they they did their piece already.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** So,  
   
 

### 00:20:48

   
**Davis Gallagher:** Cool. Thank you. And I saw that the like I said the November and December parts data was uploaded to the Google Drive as  
**Tim Dailey:** yep. Yep. So, you should have three months there.  
**Davis Gallagher:** well.  
**Tim Dailey:** October, November, December.  
**Davis Gallagher:** Yep.  
**Tim Dailey:** But we'll give you the whole kitten kaboodleoodle here at some  
**Davis Gallagher:** Yep.  
**Tim Dailey:** point.  
**Davis Gallagher:** Awesome. Sweet. Yeah. Then we can then we can really start testing out the the similarity scoring too.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Perfect. Um two other things. One I guess both are a little bit separate from this. one is we have the meeting with Doug on Friday.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Um, and wanted to kind of just run through quickly what the the agenda for that meeting is and make sure you're align with it. Um, and also try to, you know, get some potential talking points, anecdotes as we we think through what we're building here. So, I think generally we're going to start off kind of like in we're going to do we only have 45 minutes.  
   
 

### 00:21:35 {#00:21:35}

   
**Davis Gallagher:** We're going to do 15 minute segments. The first 15 minutes are going to focus on primarily updates and progress on our use cases. So like what is our overall functionality? What are some of the enhancements we've made since the last time that we met as a group? Uh what is on our roadmap of enhancements to be made? How are we tracking to our overall timeline for go live?  
**Tim Dailey:** Yep.  
**Davis Gallagher:** And then talking a little bit about the the impact and what we're feeling from a potential business impact perspective. That'll be the first probably piece of conversation. Then we'll use the next 10 to 15 minutes just to talk about AX as a broader piece because that's going to be pivotal to services quote claims to PO transportation use cases. And then Amy has a few other automation use cases that she's kind of thought through that potentially would rely on AX  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** integration. So I want to speak on that. Just want especially after we have the meeting tomorrow with Glenn Ray and Ray just provide a quick update on the progress and then kind of wrap it up talking more about I know we had that workshop in January.  
   
 

### 00:22:27 {#00:22:27}

   
**Davis Gallagher:** Amy has a bunch of ideas on automations now that she has this finance team in sales ops and just leaving some space to talk about those and what those look like.  
**Herbert Gomes Miranda:** I  
**Davis Gallagher:** That's the general run show. Does that make sense to you?  
**Herbert Gomes Miranda:** don't  
**Tim Dailey:** Sure does.  
**Davis Gallagher:** Okay,  
**Tim Dailey:** And what I'll do is I've I've gone through the the on-site and I have some some meetings or some of the  
**Davis Gallagher:** sweet.  
**Tim Dailey:** projects that I think make sense to to bring in. So if you have some of those as well, we can talk about what what's what's the road map here look like?  
**Davis Gallagher:** Yeah, if you have that, um, do you think you could send me a copy just so that I can, you know,  
**Tim Dailey:** Yeah.  
**Davis Gallagher:** potentially include like as a highle view in the deck?  
**Tim Dailey:** Yep.  
**Davis Gallagher:** That'd be great. Thank you. And in terms of um, I guess impact, I know we're still kind of in pilot phase. We're obviously not to production and the goal is to generally reduce the time it takes to create a quote  
   
 

### 00:23:10 {#00:23:10}

   
**Tim Dailey:** Yeah.  
**Davis Gallagher:** and reduce the manual process for quote generation and implementation or uploading into AX.  
**Herbert Gomes Miranda:** Good  
**Davis Gallagher:** wanted to see if like from a a business lever perspective or like a value perspective is there anything  
**Herbert Gomes Miranda:** job.  
**Davis Gallagher:** that you know I guess like I said we're knowing we're still in pilot and there's not a full you know cohort of strategic value yet but obviously the whole goal of this is to provide real actual business value at the end of the day.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** So want to make sure that you know we're tracking there and especially as we think of value levers we're we're thinking about the right  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** ones to talk about and set our goals too.  
**Tim Dailey:** I have those in the project chart that I wrote and it's it's headcount and turnaround time. Uh those are the two ones I had when I was doing project justification on my side. Those are the two I was looking at.  
**Davis Gallagher:** headcount in terms of not having to scale headcount to in like to handle an increased volume of quoting for our business.  
   
 

### 00:24:04 {#00:24:04}

   
**Davis Gallagher:** And then turnaround time obviously being just the amount of time that we can generate, determine what a quote is and send it out to a customer.  
**Tim Dailey:** Yep.  
**Davis Gallagher:** Okay.  
**Tim Dailey:** And you guys are going to smoke the second one because we're we're at um when I last looked we were like 1.8 days for a turnaround.  
**Davis Gallagher:** Okay,  
**Tim Dailey:** So I don't think this thing is gonna have to,  
**Davis Gallagher:** good.  
**Tim Dailey:** you know, few minutes I think is going to be the turnaround. So um and it's a big one for  
**Davis Gallagher:** Yeah, exactly.  
**Tim Dailey:** us.  
**Davis Gallagher:** Awesome. Sweet. Okay, perfect. Uh,  
**Tim Dailey:** And I can speak to that one too.  
**Davis Gallagher:** only other thing.  
**Tim Dailey:** There's still business value without even be able to push back into AX and it's the turnaround  
**Davis Gallagher:** Yep. Yep.  
**Tim Dailey:** time.  
**Davis Gallagher:** Okay. Yeah, that that would be great. And uh we'll we'll keep it open. We'll just keep it more of as a conversation than like a you know full like you know just a checking the box PowerPoint type thing.  
   
 

### 00:24:54 {#00:24:54}

   
**Tim Dailey:** Yep.  
**Davis Gallagher:** But just wanted to make you aware before we have that call. Cool. And the only other thing is the GCSS data.  
**Tim Dailey:** Good.  
**Davis Gallagher:** Um I thought I was pleasantly pleased with that conversation. And I think um to Ray's point, having the comments field so that there's certain eligibility criteria beyond just meeting, you know, the one, two, three that they had in those tables is like definitely a necessity. Um but other than that, like it seems like we're we're going to get access relatively soon. And yeah,  
**Tim Dailey:** That looks good.  
**Davis Gallagher:** we can potentially that's something we could talk about in that last 15 minutes too is, you know,  
**Tim Dailey:** I What I wasn't happy with was with them patting themselves on the back of how fast they've gotten us the data.  
**Davis Gallagher:** our next focus.  
**Tim Dailey:** I almost unmuted and came on glued, but I don't want I didn't want to derail progress.  
**Davis Gallagher:** I'm not gonna lie to you. I I sent a ping to Ry and I was like I love the I love the bragging about the timeline and how quickly they were able to turn this  
   
 

### 00:25:46

   
**Tim Dailey:** I I will make a comment to that once you guys have the data.  
**Davis Gallagher:** around.  
**Tim Dailey:** I already Yes, I have a comment for them on that, but I didn't want to derail where where we're going right now. But I saw that I my eyes almost fell out of my head just how big my eyes rolled.  
**Davis Gallagher:** Now let me It was also pretty funny too when uh they were going through the timeline and they were like, "Hey, we're going to do it by this, but it might take seven or two seven days or two more weeks more." Just want to make sure you guys are aware of it.  
**Tim Dailey:** right?  
**Davis Gallagher:** Always got to have the  
**Tim Dailey:** Yeah,  
**Davis Gallagher:** caveat.  
**Tim Dailey:** cat's not very agile as your guys are seeing.  
**Davis Gallagher:** Yeah,  
**Tim Dailey:** So I think most large lot of  
**Davis Gallagher:** unfortunately like caterpillars. Yeah, I was say unfortunately like caterpillar is not the same thing as deoid obviously,  
**Tim Dailey:** layers  
**Davis Gallagher:** but let me tell you that we also operated with the speed of uh you know the tortoise in the tortoise in the hair.  
   
 

### 00:26:40

   
**Tim Dailey:** right the new regime that's I've been throwing that back at them the new they they're going over new executive leadership account they turn over every eight years kind of do you know new leadership in there like most big companies And their big thing is agility. They want to be fast. They want to give you answers fast. So, um, anytimes they're not, that's why I throw it right back at them. Is this as fast? I don't if you saw the first email that got this kicked off. I said, "Is this the velocity that you guys have been talking about?" Well, since October,  
**Davis Gallagher:** I didn't see that.  
**Tim Dailey:** so  
**Davis Gallagher:** That's too funny. Well, hopefully the the agility is, you know, just building in the pipeline and uh you  
**Tim Dailey:** hope, you know, it doesn't take a long time for them to change,  
**Davis Gallagher:** know.  
**Tim Dailey:** you know, change their stripes. So, hopefully we get that. But okay, I'm  
**Davis Gallagher:** Yeah. Awesome. Yeah. Um, yeah,  
**Tim Dailey:** good.  
**Davis Gallagher:** like I said, we can talk more about the GCSS and the the actual sales quoting process, uh, potentially, you know, as the last 15 minutes of that call as well, because I I know that was a a high priority one, um,  
**Tim Dailey:** Yep.  
**Davis Gallagher:** to be able to actually like help generate sales quotes and then as part of that also find the correct uh, programs to sign up for after a sale.  
**Tim Dailey:** Yep. That's a big That's huge.  
**Davis Gallagher:** Um,  
**Tim Dailey:** Huge.  
**Davis Gallagher:** Yep. So, we'll we'll talk about that a little bit more probably on the call on Friday. Sweet. All right.  
   
 

### Transcription ended after 00:28:21

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*