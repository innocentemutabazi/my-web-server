const { getLocationAndWeather, getClientIp } = require("../utils/helpers");

const getTemperatureInLocation = async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  const clientIp = getClientIp(req);

  console.log(
    `Request received: visitor_name=${visitorName}, client_ip=${clientIp}`
  );

  if (!clientIp) {
    console.error("Client IP is undefined");
    return res.status(400).json({ error: "Client IP is undefined" });
  }

  try {
    const { location, temperature } = await getLocationAndWeather(clientIp);
    res.status(200).json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getTemperatureInLocation;
