"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.HealthCheckRating = void 0;
// HealthCheckRating enum
var HealthCheckRating;
(function (HealthCheckRating) {
    HealthCheckRating[HealthCheckRating["Healthy"] = 1] = "Healthy";
    HealthCheckRating[HealthCheckRating["LowRisk"] = 2] = "LowRisk";
    HealthCheckRating[HealthCheckRating["HighRisk"] = 3] = "HighRisk";
    HealthCheckRating[HealthCheckRating["CriticalRisk"] = 4] = "CriticalRisk";
})(HealthCheckRating || (exports.HealthCheckRating = HealthCheckRating = {}));
// Gender enum
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
