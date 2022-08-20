// this will allow us to import our variable
require("dotenv").config();
// the following lines are required to initialize a Notion client
const { Client } = require("@notionhq/client");
// this line initializes the Notion Client using our key
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_API_DATABASE;
const puppeteer = require('puppeteer')


const getDatabase = async () => {
    const response = await notion.databases.query({ database_id: databaseId });

    console.log(response.results[0].properties.url.url);
};


cretePages = async function (obj) {
    const response = await notion.pages.create({
        parent: {
            database_id: process.env.NOTION_API_DATABASE,
        },
        properties: {
            name: {
                title: [
                    {
                        text: {
                            content: obj.name_jobs,
                        },
                    },
                ],
            },
            phone : {
                rich_text: [
                    {
                        text: {
                            content: obj.phone,
                        },
                    },
                ],
            },
            url: {
                url: obj.url
            }
        },
    });

    return response;
};




exports.HHru = async (login, password)=>{

    const browser = await puppeteer.launch({headless: false});//headless: false показывать браузер
    const authUser = async (login, password)=>{

        let start_url = 'https://hh.ru/search/vacancy?text=&salary=40000&currency_code=RUR&only_with_salary=true&experience=noExperience&employment=full&schedule=remote&order_by=relevance&search_period=0&items_on_page=100&no_magic=true&L_save_area=true&page=0&hhtmFrom=vacancy_search_list'
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.goto(start_url);


        let auth_button =  "body > div.HH-Supernova-Search-Container.supernova-navi-search-wrapper.supernova-navi-search-wrapper_expanded.supernova-navi-search-wrapper_search-page > div.supernova-navi-wrapper > div > div > div > div:nth-child(8) > a"
        await page.click(auth_button); // нажатие на кнопку
        await page.waitFor(3000);
        await page.click('.account-login-actions > .bloko-link')


        await page.waitForSelector('.bloko-input_password', {visible: true})
        await page.type('.bloko-form-item > input', login); // почта
        await page.type('.bloko-input_password', password); // пароль
        await page.waitFor(3000);
        await page.click('.account-login-actions > .bloko-button_kind-primary');
    }


    await authUser(login, password)


    const list = await browser.newPage();
    await list.setViewport({
        width: 1920,
        height: 1080,
    });
    await list.goto('https://surgut.hh.ru/search/vacancy?area=1381&employment=full&employment=part&excluded_text=%D0%9C%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80+%D0%B2+%D1%81%D0%B0%D0%BB%D0%BE%D0%BD+%D1%81%D0%B2%D1%8F%D0%B7%D0%B8&experience=noExperience&schedule=fullDay&schedule=shift&schedule=flexible&schedule=remote&search_field=name&search_field=company_name&search_field=description&salary=40000&text=&order_by=relevance&search_period=0&items_on_page=100&no_magic=true&L_save_area=true&page=1&hhtmFrom=vacancy_search_list');
    await list.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await list.waitForSelector('#a11y-main-content .vacancy-serp-item .vacancy-serp-item__controls-item_contacts .bloko-button', {visible: true})
    const result = await list.evaluate(async ()=>{ // Здесь работаю с DOM
        // const buttons__info = document.querySelectorAll('#a11y-main-content .vacancy-serp-item .vacancy-serp-item__controls-item_contacts .bloko-button'); // показать контакты
        // const buttons__echo = document.querySelectorAll('#a11y-main-content .vacancy-serp-item .vacancy-serp-item__controls-item .bloko-button'); //откликнуться
        //
        // buttons__info.forEach((el, index)=>{
        //     let full_info = {}
        //     let names = document.querySelectorAll('#a11y-main-content .vacancy-serp-item .resume-search-item__name a')[0]
        //     el.click()
        //     setTimeout(()=>{
        //         let phone = document.querySelectorAll('.bloko-drop__content-wrapper .vacancy-contacts__phone-link');
        //         let all_phone = ''
        //         phone.forEach(el=>{
        //             all_phone += ` ${el.innerText}`
        //         })
        //         let info = document.querySelector('.bloko-drop__content-wrapper .bloko-text');
        //         full_info.phone = all_phone
        //         full_info.info = info
        //     }, 1000)
        //     buttons__echo[index].click()
        //
        // })
        const buttons__info = document.querySelectorAll('#a11y-main-content .vacancy-serp-item .vacancy-serp-item__controls-item_contacts .bloko-button')[0] // показать контакты
        const buttons__echo = document.querySelectorAll('#a11y-main-content .vacancy-serp-item .vacancy-serp-item__controls-item .bloko-button')[1] //откликнуться
        const name_jobs = document.querySelectorAll('#a11y-main-content .vacancy-serp-item .resume-search-item__name a')[1].innerHTML // название вакансии

        var full_info = {}
        setTimeout(()=>{
            buttons__info.click()
        }, 1000)
        console.log('нажал на информацию')
        let info
        setTimeout(()=>{
            info = document.querySelector('.bloko-drop__content-wrapper .bloko-text').innerHTML // имя храниться
            full_info.info = info;
            full_info.name_jobs = name_jobs
        }, 3000)
        console.log(info)


        let phone = document.querySelectorAll('.bloko-drop__content-wrapper .vacancy-contacts__phone-link');
        let all_phone = '';
        phone.forEach(el=>{
            all_phone += ` ${el.innerText}`
        })
        full_info.phone = all_phone;
        console.log(full_info)
        await cretePages(full_info)
        return full_info
       // return undefined
    })
    console.log(result)

    //browser.close();
    // return result;


}




