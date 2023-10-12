<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/euskalbar/euskalbar">
    <img src="src/resources/images/euskalbar64.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Euskalbar</h3>

  <p align="center">
    Basque translator's friend.
    Dictionaries, glossaries, corpora and more at one click.
    <br />
    <a href="https://addons.mozilla.org/en-US/firefox/addon/euskalbar/">Addon Webpage</a>
    ·
    <a href="https://github.com/euskalbar/euskalbar/issues/new">Report a Bug or Request a Feature</a>
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
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#testing-the-extension">Testing the extension</a></li>
        <li><a href="#building-the-extension">Building the extension</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

**Euskalbar** is a browser extension designed to facilitate the translation of words and phrases between Basque and other languages.
Born out of a passion for promoting the Basque language and making it more accessible to a global audience, Euskalbar aims to provide a seamless translation experience for users.

### Features

* Multiple Dictionaries: Access a variety of dictionaries and resources to get the most accurate translations.
* User-friendly Interface: A clean and intuitive interface ensures users can easily navigate and use the extension.
* Customizable Settings: Tailor the extension's behavior according to your preferences.
* Statistics & Analytics: Gain insights into your translation habits and frequently used dictionaries.

### Motivation

The Basque language, known as Euskara, is one of the oldest languages still spoken today.
With a rich history and unique linguistic characteristics, it's a treasure that deserves preservation and promotion.
Euskalbar is our contribution to this cause, aiming to bridge the gap between the Basque language and the world.

### Built With
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

To be able to test the extension, you need Mozilla's web-ext [![NPM Version](https://badge.fury.io/js/web-ext.svg)](https://www.npmjs.com/package/web-ext).
* npm
  ```sh
  npm install web-ext@latest -g
  ```

### Testing the extension

1. Go inside the ``src`` folder of the downloaded code.
2. Run ``web-ext run`` ([more info on the web-ext tool](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext))

### Building the extension

You can create the extension file in one of two ways:

* ``zip -r ../euskalbar-0.0.zip *``. You will get a ZIP file named "euskalbar-0.0.zip" (change the 0.0 part of the name to what you need; the real version number is defined in the "src/manifest.json" file).
* ``web-ext build -a ..``. You will get a ZIP file named "euskalbar-0.0.zip", with the real version number defined in the "src/manifest.json" file instead of the 0.0 part of the name).

The built extension can be installed and run in Developer Edition, Nightly, and ESR versions of Firefox, after toggling the "xpinstall.signatures.required" preference in "about:config".

For installation in any Firefox, extension has to be signed ([more info here](https://developer.mozilla.org/en-US/Add-ons/Distribution)).

_Below are the instructions on how to download and test the extension in Firefox Developer Edition._

1. Clone the repo and enter the root folder
   ```sh
   git clone https://github.com/euskalbar/euskalbar.git
   ```
2. Go to `src` folder
   ```sh
   cd src
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Test the extension
   ```sh
   web-ext run
   ```
   ([more info on the web-ext tool](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext))

### Building the Extension

The extension can be zipped to a file with the web-ext NPM package.

```sh
web-ext build -a ..
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

We appreciate your interest in contributing to Euskalbar! Whether you're fixing bugs, adding new features, or improving documentation, your efforts will make a significant impact. Follow the steps below to contribute:

### 1. **Fork the Project**:

- Navigate to the [Euskalbar repository](https://github.com/euskalbar/euskalbar) on GitHub.
- Click the "Fork" button in the top-right corner. This will create a copy of the repository in your GitHub account.

### 2. **Set Up Your Development Environment**:

```bash
# Clone the forked repository to your local machine
git clone https://github.com/YOUR_USERNAME/euskalbar.git

# Navigate to the cloned directory
cd euskalbar

# Install the required dependencies (assuming the project uses npm)
npm install
```

### 3. **Create a New Branch**:

Before making any changes, create a new branch for your task. This ensures that the `main` or `master` branch remains stable.

```bash
# Create a new branch (replace 'feature/your-branch-name' with a suitable name for your branch)
git checkout -b feature/your-branch-name
```

### 4. **Make Your Changes**:

With your branch ready, you can start making changes to the code. Ensure that your code adheres to the project's coding standards and guidelines.

### 5. **Commit Your Changes**:

After making your changes, commit them with a descriptive commit message.

```bash
# Add the changed files to staging
git add .

# Commit the changes
git commit -m "Your descriptive commit message here"
```

### 6. **Push to GitHub**:

Once you've committed your changes, push your branch to GitHub.

```bash
# Push your branch to GitHub
git push origin feature/your-branch-name
```

### 7. **Create a Pull Request (PR)**:

- Go to your forked Euskalbar repository on GitHub.
- Click on the "Pull requests" tab.
- Click the "New pull request" button.
- Choose your branch from the dropdown and ensure it's being merged into the correct target branch (usually `main` or `master`).
- Fill out the PR template with details about your changes, any related issues, and other relevant information.
- Click "Create pull request."

### 8. **Wait for Review**:

Once your PR is submitted, maintainers or other contributors will review your changes. They may provide feedback or request changes. Ensure to address any feedback to get your PR merged.

---

Thank you for your contribution to Euskalbar! Your efforts help improve the project for everyone.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgements

We extend our deepest gratitude to the dedicated individuals who have played pivotal roles in the development, improvement, and support of Euskalbar. Their contributions have been instrumental in shaping the project and ensuring its continued success.

- **[Juanan Pereira Varela](https://github.com/juananpe)**: Juanan laid the foundation of Euskalbar with his initial commits and development efforts. His vision set the direction for the project's journey.

- **[Asier Sarasua Garmendia](https://github.com/asiersarasua)**: As a main developer, Asier's technical expertise and commitment have been invaluable. His contributions have significantly shaped the core functionalities of Euskalbar.

- **[Julen Ruiz Aizpuru](https://github.com/julen)**: As another main developer, Julen's dedication and technical prowess have been crucial in ensuring the project's robustness and adaptability.

- **[Igor Leturia Azkarate](https://github.com/e-gor)**: Igor's efforts in migrating Euskalbar to version 4 and transitioning it to the WebExtension format have ensured the project's compatibility with newer versions of Firefox, keeping it relevant and accessible to users.

- **[Mari Susperregi](https://github.com/msusperregi)**: Representing the Elhuyar Foundation, Mari has provided invaluable support by integrating dictionaries, ensuring that Euskalbar benefits from the backing of a renowned institution.

To each of these contributors and the broader community, we say thank you. Your passion, expertise, and commitment have made Euskalbar a beacon for the Basque language in the digital age.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/euskalbar/euskalbar.svg?style=for-the-badge
[contributors-url]: https://github.com/euskalbar/euskalbar/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/euskalbar/euskalbar.svg?style=for-the-badge
[forks-url]: https://github.com/euskalbar/euskalbar/network/members
[stars-shield]: https://img.shields.io/github/stars/euskalbar/euskalbar.svg?style=for-the-badge
[stars-url]: https://github.com/euskalbar/euskalbar/stargazers
[issues-shield]: https://img.shields.io/github/issues/euskalbar/euskalbar.svg?style=for-the-badge
[issues-url]: https://github.com/euskalbar/euskalbar/issues
[license-shield]: https://img.shields.io/github/license/euskalbar/euskalbar.svg?style=for-the-badge
[license-url]: https://github.com/euskalbar/euskalbar/blob/master/LICENSE
