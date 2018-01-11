* ADDING A COMPONENT =======================================================
  * if it has its own vuex module, declare it first as a constant, then be sure to add it to the main.js module declarations.
  * be sure to add the template mixin to index.pug
  * if it has its own css file, be sure to add it to the imports in css/main.scss
  * add to router.js if there is a route to the component - if it is a page
* dev conventions ==========================================================
    * single main instance - handle page changes with router
    * components
        * use the name attribute to make vue devtools easier to read
        * keep component template inline expressions simple
            * don't put lots of code into mustache brackets
            * move code to methods and computed properties
        * keep component props as primitive as possible
            * strings, numbers, booleans
            * not complex objects
            * code is easier to read and decipher
        * give props a type option
            * ex: max: {type: Number}
        * give props a default function
            * ex: default() {return 10}
        * alphabetize elements within props, data, methods, computed, etc. to make things easier to find.
    * router calls components
        * always use named views - https://router.vuejs.org/en/essentials/named-views.html
        *
    * uses vuex for state management
        * modules will be namespaced. Calls for state, getter, mutation, and actions will need to be prefaced with the module name - for example 'account/isAdmin'
    * naming conventions
        * main instance
            * var name: projectnameabbrev_main (snake_case)
            * vue registration name: projectnameabbrevMain (camelCase)
            * pretty much the same as components
        * catch-all rules
            * unless otherwise noted, lowercase snake_case
        * every js file
            * header, in comments
                * file name
                * find tag: project_abbrev_filename with no suffix_js
                * this helps find the code in the concatenated index.js in browser
        * router
            * path names - kebab-case
            * all navigation items are part of path
            * selection id's part of path as well
        * css
            * template ids - always have -template suffix
            * use BEM (Block - Element - Modifier) classes
                * block: top-level abstraction
                    * named for component if applicable
                    * otherwise kebab-case and as simple as possible
                    * ex: container, checkbox-container
                * element
                    * an element inside a block
                    * use double__underscores
                    * ex: container__button
                * modifier
                    * modifies an element
                    * use double dashes
                    * ex: container--leftmargin
        * vuex
            * main instantiation
                * var name: project_name_abbrev_store
            * state
                * all_lower_snake_case
            * getters
                * all_lower_snake_case
            * mutations
                * ALL_UPPER_SNAKE_CASE
            * actions
                * ALL_UPPER_SNAKE_CASE
        * components
            * group in one file per page
            * file name
                * page_name.js (lowercase snake_case)
                * page_name.pug (lowercase snake_case)
                    * mixin name for component template
            * const var name
                * snake_case
                * prefix with short project code
                    * ex: apadm = apana admin project
                * example: apadm_vuex_counter
            * vue registration name
                * camelCase (ex - 'apadmVuexCounter')
            * in view or mixin
                * reference as kebab-case (ex - 'apadm-vuex-counter')
            * computed properties
                * simplest possible snake_case name
            * methods
                * simplest possible snake_case name
            * event handler
                * $emit(event-name)
                * kebab-case
                * use component name as prefix to avoid DOM compatibility issues
        * avoid this.$parent and this.$refs
            * if you need this your life took a wrong turn somewhere
* project directory structure ================================================
    * app ƒ
        * index.pug
            * main index page
        * main.js
            * central vuex instance
            * central vue instance
        * lib ƒ
            * environment.proto
                * doesn't compile with gulp, but goes across with git
            * filters
                * [filter_name].js
                * https://vuejs.org/v2/guide/filters.html
                * example: translate.js
                    * needs to include and reference the language files
            * router.js
                * router that relates routes to components
        * language
            * [langcode].js
            * file per language
            * will get these via http call with axios, that way it will only load one language set at a time, and can change at user's choice.
        * components ƒ
            * for site-wide reusable components
            * folder per component
                * named per component
            * [component_name]_template.pug
            * [component_name].js
            * [component_name].less
            * module_[component_name].js
            * README.md
        * pages ƒ
            * [page_name] ƒ
                * templates_[page].pug
                * [page_name].js
                    * contains components unique to page
                    * component template include
                        * template: require(./templates/templates_[page].html)
                    * component uses vuex items in module_[page].js
                    * component uses templates in mixins_[page].pug
                * module_[page].js
                    * starts with const module_[page] = {...}
                * [page_name].less
                    * css specific to this page
                * README.md
                    * description of component(s) and such per page
        * img ƒ
        * css ƒ
            * main.css consolidates all sass calls
    * ignore ƒ
        * environment.js
            * const env = {}
        * db.json
        * tmp files
        * files for .gitignore
    * build
        * index.html
        * index.js
        * index.css
        * img ƒ
        * language ƒ
        * fonts ƒ
    * node_modules ƒ
    * .gitignore
    * gulpfile.js
    * package.json
    * yarn.lock
* gulp compile order =====================================================
    * node_modules
        * jquery
        * vue.js
        * vue-router.js
        * vuex.js
        * vue-cookie
            * https://github.com/alfhen/vue-cookie
        * moment.js
        * axios.js
        * lodash.js
        * bootstrap
        *  --> build/index.js
    * app/language/* --> build/language
    * node_modules/fonts --> build/fonts
    * app/img/* --> build/img
    * app/ignore/environment.js --> build/index.js
    * app/**/module*.js --> build/index.js
    * app/filters/*.js --> build/index.js
    * app/router.js --> build/index.js
    * app/main.js --> build/index.js
    * app/pages/*pug --> ignore/templates.pug concat
    * app/index.pug --> build/index.html
    * app/css/main.css --> build/index.css
