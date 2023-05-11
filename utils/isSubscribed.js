const isSubscribed = (user) =>  {
    if(user.subscription=== 'active'){
        return 'active';
    } else return 'inactive';
}

module.exports = isSubscribed;