from flask import Flask, render_template, request, jsonify
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Predefined general pyramid overview (no scenario selected yet)
general_pyramid = {
    "foundation": " FOUNDATION: Implement basic technical controls and patch management, and foster a security-aware culture.",
    "core": " CORE: Conduct risk assessments, implement a governance framework, and establish continuous monitoring.",
    "adaptation": "ADAPTATION: Collaborate with threat intelligence providers and experiment with emerging security technologies.",
    "integration": "INTEGRATION: Align security strategies with business goals and integrate security measures across systems.",
    "resilience": "RESILIENCE: Cultivate a strong cybersecurity culture and train employees on security best practices."
}

# Predefined risk scenarios
risk_scenarios = {
    "phishing": {
        "foundation": "FOUNDATION: Monitor email traffic for suspicious patterns. Implement secure email filters to block phishing attempts. Conduct regular patch management to close security vulnerabilities.",
        "core": " CORE: Conduct a risk assessment to identify potential threats from phishing attacks. Implement an anti-phishing program and develop an incident response plan specific to phishing incidents.",
        "adaptation": " ADAPTATION: Collaborate with threat intelligence providers to stay updated on the latest phishing tactics and malware payloads. Experiment with innovative phishing detection tools and technologies.",
        "integration": "INTEGRATION: Integrate anti-phishing tools into your email system and employee communication channels. Align anti-phishing training with overall cybersecurity policies and employee onboarding.",
        "resilience": "RESILIENCE: Conduct comprehensive security awareness and phishing simulation training. Foster a culture where employees report phishing attempts and suspicious emails."
    },
    "malware": {
        "foundation": "FOUNDATION: Deploy antivirus and anti-malware software to all systems. Keep operating systems and software updated to prevent exploitation by known malware. Restrict administrative privileges to prevent unauthorized software installations.",
        "core": "CORE: Develop a malware incident response plan, including isolation, identification, and eradication steps. Continuously monitor and audit systems to detect potential malware threats in real-time.",
        "adaptation": "ADAPTATION: Collaborate with threat intelligence services to monitor for new malware variants. Stay informed about zero-day vulnerabilities and apply patches as soon as they are available.",
        "integration": "INTEGRATION: Ensure that malware detection and prevention are integrated into the enterprise security strategy. Align security policies to limit the execution of unauthorized software on company devices.",
        "resilience": "RESILIENCE: Foster a culture where all employees are trained to avoid downloading malicious software. Reward secure behaviors, such as identifying and reporting suspicious files or behavior."
    },
    "ddos": {
        "foundation": "Implement firewalls and anti-DDoS solutions at the network perimeter to filter out malicious traffic. Use encryption to secure critical communication channels and ensure service availability.",
        "core": "CORE: Perform a risk assessment to understand the impact of potential DDoS attacks on business operations. Develop and test a DDoS mitigation strategy, including the use of cloud-based protection services.",
        "adaptation": "ADAPTATION: Monitor threat intelligence for emerging trends in DDoS tactics and vulnerabilities. Experiment with machine learning solutions to better detect and mitigate DDoS attacks in real-time.",
        "integration": "INTEGRATION: Ensure that DDoS defense mechanisms are integrated into the network infrastructure. Work with business stakeholders to align the DDoS mitigation plan with service level agreements (SLAs) and customer expectations.",
        "resilience": "RESILIENCE: Train employees on how to detect and report DDoS attacks. Develop a strong communication plan to inform stakeholders in case of an attack and ensure transparency."
    }
}

@app.route('/')
def home():
    logging.info("Rendering the homepage with general pyramid and risk scenarios.")
    return render_template('index.html', pyramid=general_pyramid, scenarios=risk_scenarios)

@app.route('/get_scenario_data', methods=['POST'])
def get_scenario_data():
    selected_risk = request.json.get('risk', '')
    logging.debug(f"Received scenario selection: {selected_risk}")
    
    if selected_risk in risk_scenarios:
        logging.info(f"Returning data for scenario: {selected_risk}")
        return jsonify(risk_scenarios[selected_risk])
    
    logging.info("Returning general pyramid data as no valid scenario was selected.")
    return jsonify(general_pyramid)

if __name__ == "__main__":
    logging.info("Starting the Flask app in debug mode.")
    app.run(debug=True)
