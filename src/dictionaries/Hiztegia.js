class Hiztegia {
    constructor(config) {
      // Based on baliabideak.js dictionaries, add all properties here
        this.name = config.name;
        this.display_name = config.display_name;
        this.description = config.description;
        this.category = config.category;
        this.home_page = config.home_page;
        this.pairs = config.pairs;
        this.url = config.url;
        this.method = config.method;
        this.content_type = config.content_type;
        this.form_name_or_index = config.form_name_or_index;
        this.form_url = config.form_url;
        this.form_method = config.form_method;
        this.hidden_elements = config.hidden_elements;
        this.elements_to_delete = config.elements_to_delete;
        this.params = config.params;
        this.transformations = config.transformations;
    }
  
    // Method to fetch data from the dictionary
    fetchData(term, source, target) {
        const apiUrl = this.buildUrl(term, source, target);
        if (this.method === 'GET') {
            return fetch(apiUrl)
                .then(response => response.json())
                .catch(error => console.error(error));
        } else if (this.method === 'POST') {
            const contentType = this.content_type || "application/x-www-form-urlencoded";
            let bodyData;
            if (contentType === "application/json") {
                bodyData = JSON.stringify(this.buildPostBodyJson(term, source, target));
            } else {
                bodyData = this.buildPostBody(term, source, target);
            }
            return fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': contentType,
                },
                body: bodyData
            })
            .then(response => response.json())
            .catch(error => console.error(error));
        }
    }

    buildPostBody(term, source, target) {
        let body = [];
        let replacements = {
            "{opts_term}": term,
            "{opts_source}": source,
            "{opts_target}": target
        };

        // Apply transformations before passing the parameters to the dictionary
        if (this.transformations) {
            for (let key in this.transformations) {
                if (this.transformations[key] === "uppercase") {
                    replacements[key] = replacements[key].toUpperCase();
                } else if (this.transformations[key] === "lowercase") {
                    replacements[key] = replacements[key].toLowerCase();
                } else if (this.transformations[key] === "capitalize") {
                    replacements[key] = replacements[key].charAt(0).toUpperCase() + replacements[key].slice(1);
                }
            }
        }

        for (let param of this.params) {
            let value = param.value;
            for (let key in replacements) {
                if (typeof value === 'string' && value.includes(key)) {
                    value = value.replace(key, encodeURIComponent(replacements[key]));
                }
            }
            body.push(encodeURIComponent(param.name) + '=' + encodeURIComponent(value));
        }
        return body.join('&');
    }

    buildPostBodyJson(term, source, target) {
        let bodyData = {};
        let replacements = {
            "{opts_term}": term,
            "{opts_source}": source,
            "{opts_target}": target
        };
    
        // Apply transformations before passing the parameters to the dictionary
        if (this.transformations) {
            for (let key in this.transformations) {
                if (this.transformations[key] === "uppercase") {
                    replacements[key] = replacements[key].toUpperCase();
                } else if (this.transformations[key] === "lowercase") {
                    replacements[key] = replacements[key].toLowerCase();
                } else if (this.transformations[key] === "capitalize") {
                    replacements[key] = replacements[key].charAt(0).toUpperCase() + replacements[key].slice(1);
                }
            }
        }
    
        for (let param of this.params) {
            let value = param.value;
            for (let key in replacements) {
                if (typeof value === 'string' && value.includes(key)) {
                    value = value.replace(key, replacements[key]);
                }
            }
            bodyData[param.name] = value;
        }
        return bodyData;
    }
  
    // Helper method to build the URL for fetching data. It must use term, source and target as query parameters, where they get assigned in the this.url property, where {opts_term}, {opts_source} and {opts_target} are replaced with the query
    buildUrl(term, source, target) {
        let url = this.url;
        if (typeof url === 'string' && url.includes("{opts_term}")) {
            url = url.replace("{opts_term}", encodeURIComponent(term));
        }
        if (typeof url === 'string' && url.includes("{opts_source}")) {
            url = url.replace("{opts_source}", encodeURIComponent(source));
        }
        if (typeof url === 'string' && url.includes("{opts_target}")) {
            url = url.replace("{opts_target}", encodeURIComponent(target));
        }
        return url;
    }
    
    // Any other methods or logic common to all dictionaries can be added here
  
  }
  
  // Export the Hiztegia class so it can be imported and used in other files
  export default Hiztegia;
