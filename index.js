const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");

app = express();
app.use(cors());

app.get("/api/login", (req, res) => {
	let data = {
		grant_type: "password",
		client_id: "6146827",
		client_secret: "qVxWRF1CwHERuIrKBnqe",
		username: req.query.login,
		password: req.query.password,
		v: "5.130",
	};

	if ("captcha_sid" in req.query) {
		data["captcha_sid"] = req.query.captcha_sid;
		data["captcha_key"] = req.query.captcha_key;
	}

	fetch("https://oauth.vk.com/token?" + new URLSearchParams(data))
		.then((res) => res.json())
		.then((data) => {
			const query = {
				token: data.access_token,
				user_id: data.user_id,
			};
			fetch("http://185.104.249.204:3436/api/user/create?" + new URLSearchParams(query))
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					res.send(data);
				});
		});
});

app.listen(5000, () => {
	console.log("Server started on port 5000");
});
