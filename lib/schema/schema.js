const graphql = require('graphql')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    animal_type: {type: GraphQLString},
    age: {type: GraphQLInt},
    favorite_treat: {type: GraphQLString},
    owner: {
      type: OwnerType,
      resolve(parent, args){
        return database('pets')
        .join('owners', {'pets.owner_id': 'owners.id'})
        .where('owners.id', parent.owner_id)
        .first()
      }
    }
  })
})

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    pets: {
      type: GraphQLList(PetType),
      resolve(parent, args){
        return database('owners')
        .join('pets', {'owners.id': 'pets.owner_id'})
        .where('pets.owner_id', parent.id)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    pet: {
      type: PetType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return database('pets').where('id', args.id).first()
      }
    },
    owner: {
      type: OwnerType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return database('owners').where('id', args.id).first()
      }
    },
    pets: {
      type: new GraphQLList(PetType),
      resolve(parents, args){
        return database('pets').select()
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addOwner: {
      type: OwnerType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve(parents, args){
        return database('owners').insert({
          name: args.name,
          age: args.age
        }, ['id', 'name', 'age'])
        .then(result => result[0])
      }
    },
    deleteOwner: {
      type: GraphQLString,
      args: {id: {type: GraphQLNonNull(GraphQLID)}},
      resolve(parent, args){
        return database('owners').where('id', args.id).del().then((result) => {
      if (result == 1) {
          return "Success!"
      } else {
        return "Fail!"
      }
      })
    }
  },
      addPet: {
        type: PetType,
        args: {
          name: {type: GraphQLNonNull(GraphQLString)},
          age: {type: GraphQLNonNull(GraphQLInt)},
          animal_type: {type: GraphQLNonNull(GraphQLString)},
          favorite_treat: {type: GraphQLNonNull(GraphQLString)},
          owner_id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parents, args){
          return database('pets').insert({
            name: args.name,
            age: args.age,
            animal_type: args.animal_type,
            favorite_treat: args.favorite_treat,
            owner_id: args.owner_id
          }, ['id', 'name', 'age', 'animal_type', 'favorite_treat', 'owner_id'])
          .then(result => result[0])
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
