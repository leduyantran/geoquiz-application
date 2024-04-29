var express = require("express");
var router = express.Router();
var express = require("express-session");
var httpRequest = require("request");
const path = require("path");
//******************************
// require('dotenv').config();
// token = process.env.TOKEN
//******************************
const countries = require("../controllers/country.controller.js");
const users = require("../controllers/user.controller.js");

router.get("/", function handleHomePage(request, response) {
	console.log("index called");
	response.render("practice");
});

router.post("/", function handleAfricaPage(request, response) {
	response.render("practice");
});

router.post("/checkanswers", countries.checkAnswers);
router.post("/selectContinent", countries.selectContinent);

//*******************Canvas Integration**************************************************
// router.post('/submission', function handleSubmissionsPage(request, response){
// 		console.log("Entered Automatic Submission")
// 		var inputs = request.body.studentsAnswers;
// 		var comments ="";
// 		var newScore = request.body.score;
// 		for (var i =0; i < 10; i++){
// 			comments += (i+1) + ". " + inputs[i*2] + " " + inputs[(i*2)+1] + "\n";
// 		}
// 		comments += "Score: " + newScore;
// 		console.log("After contructing formatted comments" + comments);
//
//
// 		httpRequest({
// 			method: "GET",
// 			url: "https://canvas.spu.edu/api/v1/courses/"+ request.body.courseId+ "/assignments/"
// 									+ request.body.assignmentId + "/submissions/"+ request.body.userId,
// 			headers:{
// 					 "Content-Type": "application/json",
// 					 "Authorization": " Bearer " + token
//
// 				}
// 		},function(err,res,body) {
// 			if (!err && res.statusCode == 200) {
// 					 var updateScore = parseInt(JSON.parse(res.body).grade)
// 					 //When there is no value in updateScore, the value can't be parsed into an integer
// 					 	if ((updateScore < newScore) || (isNaN(updateScore))){
// 								updateScore = newScore;
// 						}
// 						 		httpRequest({
// 						 				method: "PUT",
// 						 				uri: "https://canvas.spu.edu/api/v1/courses/"+ request.body.courseId+ "/assignments/"
// 						 										+ request.body.assignmentId + "/submissions/"+ request.body.userId,
// 						 			 headers:{
// 						 						"Content-Type": "application/json",
// 						 						"Authorization": " Bearer " +token
//
// 						 				 },
// 						 				 form: {
// 						 					 	'course_id': request.body.courseId,
// 						 						'assignment_id': request.body.assignmentId,
// 						 						'user_id': request.body.userId,
// 						 						'author_id': request.body.userId,
// 						 						 'submission[posted_grade]': updateScore,
// 						 						 "workflow_state": "graded",
// 						 						 "comment[text_comment]": comments
// 						 				 }
// 						 		 	},function (er,res,body){
// 						 			 if (!er && res.statusCode == 200) {
// 						 						console.log("Grade Entered");
// 						 					response.status(204).send();
// 						 				}
// 						 				else{
// 						 					console.log(res);
// 											console.log(er)
// 						 				}
// 						 		 })
// 	  }
// 	})
// });
// 	 router.post('/quizStarted', function handlequizStarted(request,response){
// 	 	// console.log("entered quizStarted router")
// 	 	httpRequest({
// 	 			method: "PUT",
// 	 			uri: "https://canvas.spu.edu/api/v1/courses/"+ request.body.courseId+ "/assignments/"
// 	 									+request.body.assignmentId + "/submissions/"+ request.body.userId,
// 	 		 headers:{
// 	 					"Content-Type": "application/json",
// 	 					"Authorization": " Bearer " + token
//
// 	 			 },
// 	 			 form: {
// 	 					'course_id':  request.body.courseId,
// 	 					'assignment_id': request.body.assignmentId,
// 	 					'user_id': request.body.userId,
// 	 					"comment[text_comment]": "Quiz started"
// 	 			 }
// 	 		},function (er,res,body){
// 	 		 if (!er && res.statusCode == 200) {
// 	 				console.log("Quiz Started Comment Sent");
// 	 				response.status(204).send();
// 	 			}
// 	 			else{
// 	 				console.log(er);
// 	 				console.log(res);
// 	 			}
// 	 	 });
// 		})
//***********************************************************************************************
//***********************************************************************************************
router.post("/addData", countries.addData);
router.post("/deleteData", countries.delete);
router.post("/addCountry", countries.create);
router.post("/removeCountry", countries.removeCountry);
router.post("/fileUpload", countries.fileUpload);
router.post("/checkUser", users.checkUser);
router.post("/createUser", users.create);
router.post("/removeUser", users.delete);
router.get("/logout", users.logout);
router.get("/listUsers", users.listUsers);
router.get("/login", function handleLoginPage(request, response) {
	response.render("login", { message: "Welcome!" });
});

router.get("/countries", countries.findAll);
router.get("/countries/:continent", countries.findCountriesInContinent);
router.get("/quiz/:continent", countries.sendRandomCountries);
router.get("/background/:continent", countries.allButOneContinent);
router.get("/getCountryInfo", countries.getCountryInfo);
router.put("/update", countries.update);

router.post("/:continent", function handleAfricaPage(request, response) {
	var practice = false;
	console.log("Got the POST request " + request.params.continent);

	var courseID = request.body.custom_canvas_course_id;
	var assignmentID = request.body.custom_canvas_assignment_id;
	var userId = request.body.custom_canvas_user_id;

	response.render("index", {
		continent: request.params.continent,
		practice: practice,
		user: userId,
		assignment: assignmentID,
		course: courseID,
	});
});
router.get("/manageUser", users.manageUser);
//editBorders, editCountry, fileUpload,crud pages
router.get("/:page", function handleAddDataPage(request, response) {
	console.log(request.params.page);
	if (request.session.user) {
		response.render(request.params.page);
	} else {
		response.render("login", { message: "Login required" });
	}
});

module.exports = router;
