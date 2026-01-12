<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sprusrxeroxx/Jobly">
    <img src="jobly Logo.jpg" alt="Jobly Logo" width="200" height="200">
  </a>

<h3 align="center">JOBLY</h3>

  <p align="center">
    <strong>The Career Platform That Fights Back.</strong>
    <br />
    Job hunting is broken. The system is rigged by ATS bots and "social" networks that care more about engagement than your employment. Jobly rigs it back in your favor.
    <br />
    <br />
    <a href="https://jobly.flutterflow.app/"><strong>View Live Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/sprusrxeroxx/Jobly/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/sprusrxeroxx/Jobly/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Let's be honest: the modern hiring process is a black box. You spend hours crafting a resume only to have it rejected by an Applicant Tracking System (ATS) before a human ever sees it. Meanwhile, other platforms want you to spend your time "connecting" and posting "humble brags" instead of actually getting work.

**Jobly is not a social network.** We don't care about your engagement metrics. We care about your offer letter.

Jobly is a career arsenal designed to beat the bots at their own game. Using a **GAN-inspired (Generative Adversarial Network)** approach, our AI generates multiple iterations of your resume, pitting them against a virtual ATS discriminator until we forge a document that is mathematically optimized to get you an interview.

It is a full-stack career platform built for the job seeker who is tired of the status quo.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built using a robust, scalable tech stack designed for performance and real-time capability.

* [![Flutter][Flutter.dev]][Flutter-url] - **Frontend**: Cross-platform native performance.
* [![Firebase][Firebase.com]][Firebase-url] - **Backend**: Auth, Firestore, Cloud Functions, and Hosting.
* [![Google Gemini][Gemini.google]][Gemini-url] - **AI Core**: Powering the adversarial generation and analysis.
* [![Node][Node.js]][Node-url] - **Cloud Functions**: Serverless compute for resume processing.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->
## Features

Jobly is currently in active development. Here is what you can do right now:

*   **Adversarial Resume Generation**: Upload your current resume and a target job description. Our AI generates a new version, critiques it, fixes it, and critiques it again until it passes ATS standards.
*   **Job Management**: Search, save, and apply for jobs directly within the app.
*   **Resume/Job Parsing**: Create a tailored resume based on a PDF or text input.
*   **Feedback Loop**: Get detailed feedback on *why* your resume isn't a match and exactly *how* to improve it.
*   **Resume Management**: Save generated versions, delete old drafts, and download the final PDF.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

*   **Flutter SDK**: [Install Flutter](https://docs.flutter.dev/get-started/install)
*   **Node.js** (for Cloud Functions):
    ```sh
    npm install npm@latest -g
    ```
*   **Firebase CLI**:
    ```sh
    npm install -g firebase-tools
    ```

### Installation

1.  **Get a Gemini API Key**
    Visit [Google AI Studio](https://aistudio.google.com/) and generate an API key.

2.  **Clone the repo**
    ```sh
    git clone https://github.com/sprusrxeroxx/Jobly.git
    ```

3.  **Install Frontend Dependencies**
    ```sh
    cd Jobly
    flutter pub get
    ```

4.  **Install Backend Dependencies**
    ```sh
    cd functions
    npm install
    ```

5.  **Configure Environment**
    Create a `.env` file in the `functions/` directory and add your keys:
    ```env
    GEMINI_API_KEY='YOUR_API_KEY'
    ```

6.  **Run Locally**
    ```sh
    # Start Firebase Emulators
    firebase emulators:start

    # Run Flutter App
    flutter run
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

**The "Beat the ATS" Workflow:**
1.  Find a job listing you like.
2.  Paste the URL or description into Jobly.
3.  Upload your base resume (PDF).
4.  Hit **"Optimize"**.
5.  Watch as the Generator (AI Writer) and Discriminator (AI ATS) fight over your resume. The result is a hyper-optimized PDF ready for submission.

_For more examples, please refer to the [Documentation](https://github.com/sprusrxeroxx/Jobly/wiki)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

We are building the ultimate career suite. Here is what is coming next:

- [ ] **Resume Score/Analysis**: Instant quantitative scoring of your resume against industry standards.
- [ ] **Skill Gap Analysis**: identifying exactly what skills you are missing for your dream role.
- [ ] **Smart Job Recommendations**: No more irrelevant spam.
- [ ] **Voice-Based Dictation**: Update your resume by just talking to it.
- [ ] **AI Interview Prep**: Mock interviews with real-time feedback based on the specific job role.
- [ ] **Task Tracking**: KanBan board for applications, with alerts for expiring listings.
- [ ] **Bulk Operations**: Tailor and apply to multiple similar jobs at once.
- [ ] **B2B Suite**: Tools for recruiters who actually want to find talent, not just filter keywords.
- [ ] **Public API**: Open access to our parsing and scoring engines.

See the [open issues](https://github.com/sprusrxeroxx/Jobly/issues) for a full list of proposed features.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the Apache2.0 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

**Sprusrxeroxx** - [GitHub](https://github.com/sprusrxeroxx)

Project Link: [https://github.com/sprusrxeroxx/Jobly](https://github.com/sprusrxeroxx/Jobly)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/sprusrxeroxx/Jobly.svg?style=for-the-badge
[contributors-url]: https://github.com/sprusrxeroxx/Jobly/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/sprusrxeroxx/Jobly.svg?style=for-the-badge
[forks-url]: https://github.com/sprusrxeroxx/Jobly/network/members
[stars-shield]: https://img.shields.io/github/stars/sprusrxeroxx/Jobly.svg?style=for-the-badge
[stars-url]: https://github.com/sprusrxeroxx/Jobly/stargazers
[issues-shield]: https://img.shields.io/github/issues/sprusrxeroxx/Jobly.svg?style=for-the-badge
[issues-url]: https://github.com/sprusrxeroxx/Jobly/issues
[license-shield]: https://img.shields.io/github/license/sprusrxeroxx/Jobly.svg?style=for-the-badge
[license-url]: https://github.com/sprusrxeroxx/Jobly/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/ntokozovilakazi-back-end-developer/
[product-screenshot]: https://vimeo.com/1153713657?share=copy&fl=sv&fe=ci
[Flutter.dev]: https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white
[Flutter-url]: https://flutter.dev/
[Firebase.com]: https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white
[Firebase-url]: https://firebase.google.com/
[Gemini.google]: https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white
[Gemini-url]: https://deepmind.google/technologies/gemini/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
